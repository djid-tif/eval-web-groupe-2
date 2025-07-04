import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Reservation } from '../reservation/reservation.entity';
import * as path from 'path';
import * as fs from 'fs';
import { createObjectCsvWriter } from 'csv-writer';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Reservation)
        private readonly reservationRepository: Repository<Reservation>,
    ) {}

    async findAll(skip = 0, limit = 10): Promise<User[]> {
        return this.userRepository.find({
            skip,
            take: limit,
            order: { created_at: 'DESC' },
        });
    }

    async findOne(id: number): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) throw new NotFoundException('User not found');
        return user;
    }

    async create(data: Partial<User>): Promise<User> {
        if (!data.email) {
            throw new BadRequestException('Email is required');
        }
        
        if (!data.keycloak_id) {
            data.keycloak_id = uuidv4();
        }
        
        const user = this.userRepository.create(data);
        return this.userRepository.save(user);
    }

    async generateCSVExtract(id: number): Promise<string> {
        const user = await this.findOne(id);
        if (!user) throw new NotFoundException('User not found');

        const reservations = await this.reservationRepository.find({
            where: { user_id: id },
            relations: ['room'],
            order: { created_at: 'DESC' },
        });

        const filename = `user_${id}_reservations.csv`;
        const exportsDir = path.join(__dirname, '../../../exports');
        const filePath = path.join(exportsDir, filename);
        
        if (!fs.existsSync(exportsDir)) {
            fs.mkdirSync(exportsDir, { recursive: true });
        }
        
        const csvWriter = createObjectCsvWriter({
            path: filePath,
            header: [
                { id: 'reservationId', title: 'reservationId' },
                { id: 'userId', title: 'userId' },
                { id: 'roomId', title: 'roomId' },
                { id: 'startTime', title: 'startTime' },
                { id: 'endTime', title: 'endTime' },
                { id: 'status', title: 'status' },
            ],
        });

        const csvData = reservations.map(reservation => ({
            reservationId: reservation.id,
            userId: reservation.user_id,
            roomId: reservation.room_id,
            startTime: reservation.start_time.toISOString(),
            endTime: reservation.end_time.toISOString(),
            status: reservation.status,
        }));

        await csvWriter.writeRecords(csvData);
        
        return `http://localhost:3000/exports/${filename}`;
    }
}
