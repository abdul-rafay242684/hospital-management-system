import { Controller, Get, Post, Body } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';

@Controller('doctors')
export class DoctorsController {
    constructor(private readonly doctorsService: DoctorsService) { }

    @Get()
    findAll() {
        return this.doctorsService.findAll();
    }

    @Post()
    create(@Body() dto: CreateDoctorDto) {
        return this.doctorsService.create(dto);
    }
}