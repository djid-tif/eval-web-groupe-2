import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation, ReservationStatus } from './reservation.entity';
import { CreateReservationDto } from "./dto/create-reservation.dto";
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class ReservationService {
    constructor(
        @InjectRepository(Reservation)
        private readonly reservationRepository: Repository<Reservation>,
        private readonly notificationService: NotificationService,
    ) {}

    async findAll(skip = 0, limit = 10): Promise<Reservation[]> {
        return this.reservationRepository.find({
            skip,
            take: limit,
            relations: ['user', 'room'],
            order: { created_at: 'DESC' },
        });
    }

    async findOne(id: number): Promise<Reservation> {
        const reservation = await this.reservationRepository.findOne({ where: { id }, relations: ['user', 'room'] });
        if (!reservation) throw new NotFoundException('Reservation not found');
        return reservation;
    }

    async create(data: CreateReservationDto): Promise<Reservation> {
        const reservation = this.reservationRepository.create({
            ...data,
            start_time: new Date(data.start_time),
            end_time: new Date(data.end_time),
        });

        const savedReservation = await this.reservationRepository.save(reservation);
        
        await this.notificationService.createNotification(
            savedReservation.id,
            `Reservation created for room ${data.room_id}`,
            'created'
        );
        
        return this.findOne(savedReservation.id);
    }

    async update(id: number, updateData: any): Promise<Reservation> {
        const reservation = await this.findOne(id);
        
        if (updateData.startTime || updateData.start_time) {
            reservation.start_time = new Date(updateData.startTime || updateData.start_time);
        }
        if (updateData.endTime || updateData.end_time) {
            reservation.end_time = new Date(updateData.endTime || updateData.end_time);
        }
        if (updateData.status) {
            reservation.status = updateData.status;
        }

        await this.reservationRepository.save(reservation);
        
        await this.notificationService.createNotification(
            id,
            `Reservation updated`,
            'updated'
        );
        
        return this.findOne(id);
    }

    async delete(id: number): Promise<void> {
        const result = await this.reservationRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException('Reservation not found');
        }
    }

    async updateStatus(id: number, status: ReservationStatus): Promise<Reservation> {
        const reservation = await this.findOne(id);
        reservation.status = status;
        await this.reservationRepository.save(reservation);
        
        await this.notificationService.createNotification(
            id,
            `Reservation status updated to ${status}`,
            'status_updated'
        );
        
        return this.findOne(id);
    }
}
