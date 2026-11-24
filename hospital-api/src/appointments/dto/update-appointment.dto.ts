import { IsOptional, IsString, IsInt } from 'class-validator';

export class UpdateAppointmentDto {
    @IsOptional()
    @IsString()
    patientName?: string;

    @IsOptional()
    @IsString()
    appointmentDate?: string;

    @IsOptional()
    @IsString()
    reason?: string;

    @IsOptional()
    @IsInt()
    doctorId?: number;
}