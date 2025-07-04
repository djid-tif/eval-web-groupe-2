import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Reservation } from '../reservation/reservation.entity';

@Entity({ name: 'notifications' })
export class Notification {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'reservation_id' })
    reservation_id: number;

    @ManyToOne(() => Reservation, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'reservation_id' })
    reservation: Reservation;

    @Column({ type: 'varchar', length: 255 })
    message: string;

    @Column({ type: 'varchar', length: 50 })
    type: string;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;
} 