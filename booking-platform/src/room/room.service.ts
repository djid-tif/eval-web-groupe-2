import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './room.entity';

@Injectable()
export class RoomService {
    constructor(
        @InjectRepository(Room)
        private readonly roomRepository: Repository<Room>,
    ) {}

    async findAll(skip = 0, limit = 10): Promise<Room[]> {
        return this.roomRepository.find({
            skip,
            take: limit,
            order: { created_at: 'DESC' },
        });
    }

    async findOne(id: number): Promise<Room> {
        const room = await this.roomRepository.findOne({ where: { id } });
        if (!room) throw new NotFoundException('Room not found');
        return room;
    }

    async create(data: Partial<Room>): Promise<Room> {
        const room = this.roomRepository.create(data);
        return this.roomRepository.save(room);
    }

    async update(id: number, data: Partial<Room>): Promise<Room> {
        const room = await this.findOne(id);
        Object.assign(room, data);
        return this.roomRepository.save(room);
    }

    async delete(id: number): Promise<void> {
        const result = await this.roomRepository.delete(id);
        if (result.affected === 0) throw new NotFoundException('Room not found');
    }
}
