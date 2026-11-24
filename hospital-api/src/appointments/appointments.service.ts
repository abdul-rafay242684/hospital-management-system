import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Injectable()
export class AppointmentsService {
    constructor(
        @InjectRepository(Appointment)
        private appointmentRepo: Repository<Appointment>,
    ) { }

    findAll() {
        return this.appointmentRepo.find({ relations: { doctor: true } });
    }

    async findOne(id: number) {
        const appointment = await this.appointmentRepo.findOne({
            where: { id },
            relations: { doctor: true },
        });
        if (!appointment) {
            throw new NotFoundException(`Appointment with ID ${id} not found`);
        }
        return appointment;
    }

    create(dto: CreateAppointmentDto) {
        const appointment = this.appointmentRepo.create(dto);
        return this.appointmentRepo.save(appointment);
    }

    async update(id: number, dto: UpdateAppointmentDto) {
        const appointment = await this.findOne(id);
        Object.assign(appointment, dto);
        return this.appointmentRepo.save(appointment);
    }

    async remove(id: number) {
        const appointment = await this.findOne(id);
        await this.appointmentRepo.remove(appointment);
        return { message: `Appointment ${id} deleted successfully` };
    }
}