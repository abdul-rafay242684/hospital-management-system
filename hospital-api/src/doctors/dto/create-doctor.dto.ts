import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDoctorDto {
    @IsNotEmpty({ message: 'Doctor name must not be empty' })
    @IsString()
    name: string;

    @IsNotEmpty({ message: 'Specialization must not be empty' })
    @IsString()
    specialization: string;
}