import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity';

@Injectable()
export class NotificationService {
    constructor(
        @InjectRepository(Notification)
        private readonly notificationRepository: Repository<Notification>,
    ) {}

    async createNotification(reservationId: number, message: string, type: string): Promise<Notification> {
        const notification = this.notificationRepository.create({
            reservation_id: reservationId,
            message,
            type,
        });

        return this.notificationRepository.save(notification);
    }

    async findByReservationId(reservationId: number): Promise<Notification[]> {
        return this.notificationRepository.find({
            where: { reservation_id: reservationId },
            order: { created_at: 'DESC' },
        });
    }
} 