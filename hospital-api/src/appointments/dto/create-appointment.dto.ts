import { IsNotEmpty, IsString, IsInt, IsOptional } from 'class-validator';

export class CreateAppointmentDto {
    @IsNotEmpty({ message: 'Patient name is required' })
    @IsString()
    patientName: string;

    @IsNotEmpty({ message: 'Appointment date is required' })
    @IsString()
    appointmentDate: string;

    @IsOptional()
    @IsString()
    reason?: string;

    @IsNotEmpty({ message: 'Doctor ID is required' })
    @IsInt()
    doctorId: number;
}