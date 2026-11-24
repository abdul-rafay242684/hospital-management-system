import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor } from './doctor.entity';
import { CreateDoctorDto } from './dto/create-doctor.dto';

@Injectable()
export class DoctorsService {
    constructor(
        @InjectRepository(Doctor)
        private doctorRepository: Repository<Doctor>,
    ) { }

    findAll() {
        return this.doctorRepository.find({ relations: { appointments: true } });
    }

    create(dto: CreateDoctorDto) {
        const doctor = this.doctorRepository.create(dto);
        return this.doctorRepository.save(doctor);
    }
}