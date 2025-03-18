import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation, ReservationStatus } from './reservation.entity';
import {CreateReservationDto} from "./dto/create-reservation.dto";

@Injectable()
export class ReservationService {
    constructor(
        @InjectRepository(Reservation)
        private readonly reservationRepository: Repository<Reservation>,
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

        return await this.reservationRepository.save(reservation);
    }

    async updateStatus(id: number, status: ReservationStatus): Promise<Reservation> {
        const reservation = await this.findOne(id);
        reservation.status = status;
        return this.reservationRepository.save(reservation);
    }
}
