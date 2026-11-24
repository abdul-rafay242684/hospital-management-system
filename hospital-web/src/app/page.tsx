'use client';

import { useState, useEffect } from 'react';

interface Doctor {
  id: number;
  name: string;
  specialization: string;
}

interface Appointment {
  id: number;
  patientName: string;
  appointmentDate: string;
  reason: string;
  doctorId: number;
  doctor?: Doctor;
}

const API_URL = 'http://localhost:3001';
const API_HEADERS = {
  'Content-Type': 'application/json',
  'x-api-key': 'hospital123',
};

export default function HospitalDashboard() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [error, setError] = useState('');

  // Doctor form states
  const [docName, setDocName] = useState('');
  const [docSpec, setDocSpec] = useState('');

  // Appointment form states
  const [patientName, setPatientName] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [reason, setReason] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchData = async () => {
    try {
      setError('');
      const [docRes, appRes] = await Promise.all([
        fetch(`${API_URL}/doctors`, { headers: API_HEADERS }),
        fetch(`${API_URL}/appointments`, { headers: API_HEADERS }),
      ]);

      if (!docRes.ok || !appRes.ok) {
        throw new Error('Failed to fetch data from backend. Check API Key or Server.');
      }

      const docsData = await docRes.json();
      const appsData = await appRes.json();
      setDoctors(docsData);
      setAppointments(appsData);
    } catch (err: any) {
      setError(err.message || 'Backend connection error');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Add Doctor
  const handleAddDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim() || !docSpec.trim()) return;

    try {
      const res = await fetch(`${API_URL}/doctors`, {
        method: 'POST',
        headers: API_HEADERS,
        body: JSON.stringify({ name: docName, specialization: docSpec }),
      });
      if (!res.ok) throw new Error('Error adding doctor');
      setDocName('');
      setDocSpec('');
      fetchData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Create or Update Appointment
  const handleAppointmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim() || !appointmentDate || !reason.trim() || !doctorId) return;

    const payload = {
      patientName,
      appointmentDate,
      reason,
      doctorId: Number(doctorId),
    };

    try {
      const url = editingId
        ? `${API_URL}/appointments/${editingId}`
        : `${API_URL}/appointments`;
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: API_HEADERS,
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Error saving appointment');

      setPatientName('');
      setAppointmentDate('');
      setReason('');
      setDoctorId('');
      setEditingId(null);
      fetchData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Populate form for Edit
  const handleEdit = (app: Appointment) => {
    setEditingId(app.id);
    setPatientName(app.patientName);
    setAppointmentDate(app.appointmentDate);
    setReason(app.reason);
    setDoctorId(String(app.doctorId));
  };

  // Delete Appointment
  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/appointments/${id}`, {
        method: 'DELETE',
        headers: API_HEADERS,
      });
      if (!res.ok) throw new Error('Error deleting appointment');
      fetchData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 text-slate-800">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <header className="bg-blue-700 text-white p-6 rounded-xl shadow-md flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Hospital Management System</h1>
            <p className="text-blue-100 text-sm mt-1">Doctors & Patient Appointments Portal</p>
          </div>
          <span className="bg-blue-800 px-4 py-1.5 rounded-full text-xs font-mono border border-blue-500">
            API Connected: localhost:3001
          </span>
        </header>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Top Section: Doctors */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add Doctor Form */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold mb-4 text-slate-900">Add New Doctor</h2>
            <form onSubmit={handleAddDoctor} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Doctor Name</label>
                <input
                  type="text"
                  placeholder="Dr. Ahmed Khan"
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Specialization</label>
                <input
                  type="text"
                  placeholder="Cardiologist"
                  value={docSpec}
                  onChange={(e) => setDocSpec(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
              >
                + Add Doctor
              </button>
            </form>
          </div>

          {/* Doctors List */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold mb-4 text-slate-900">
              Available Doctors ({doctors.length})
            </h2>
            {doctors.length === 0 ? (
              <p className="text-slate-500 text-sm">No doctors registered yet. Add one on the left!</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {doctors.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-4 border border-slate-200 rounded-lg bg-slate-50 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-bold text-slate-900">{doc.name}</p>
                      <p className="text-sm text-blue-600 font-medium">{doc.specialization}</p>
                    </div>
                    <span className="text-xs bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full font-mono">
                      ID: {doc.id}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Section: Appointments CRUD */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Book / Edit Appointment Form */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold mb-4 text-slate-900">
              {editingId ? `Edit Appointment #${editingId}` : 'Book Appointment'}
            </h2>
            <form onSubmit={handleAppointmentSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Patient Name</label>
                <input
                  type="text"
                  placeholder="Ali Raza"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Appointment Date</label>
                <input
                  type="date"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Select Doctor</label>
                <select
                  value={doctorId}
                  onChange={(e) => setDoctorId(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  required
                >
                  <option value="">-- Choose a Doctor --</option>
                  {doctors.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name} ({doc.specialization})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Reason / Symptoms</label>
                <input
                  type="text"
                  placeholder="Routine Checkup"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-lg transition"
                >
                  {editingId ? 'Update Appointment' : 'Book Appointment'}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setPatientName('');
                      setAppointmentDate('');
                      setReason('');
                      setDoctorId('');
                    }}
                    className="px-4 bg-slate-300 hover:bg-slate-400 text-slate-800 font-semibold py-2 rounded-lg transition"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Appointments Table */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
            <h2 className="text-lg font-bold mb-4 text-slate-900">
              Scheduled Appointments ({appointments.length})
            </h2>
            {appointments.length === 0 ? (
              <p className="text-slate-500 text-sm">No appointments booked yet.</p>
            ) : (
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-600">
                    <th className="py-2.5 px-3">Patient</th>
                    <th className="py-2.5 px-3">Doctor</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Reason</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((app) => (
                    <tr key={app.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-3 font-medium text-slate-900">{app.patientName}</td>
                      <td className="py-3 px-3 text-blue-700">
                        {app.doctor ? app.doctor.name : `Doctor #${app.doctorId}`}
                      </td>
                      <td className="py-3 px-3">{app.appointmentDate}</td>
                      <td className="py-3 px-3 text-slate-600">{app.reason}</td>
                      <td className="py-3 px-3 text-right space-x-2">
                        <button
                          onClick={() => handleEdit(app)}
                          className="bg-amber-100 hover:bg-amber-200 text-amber-800 px-3 py-1 rounded font-medium transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(app.id)}
                          className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded font-medium transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}