import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './room.entity';

@Injectable()
export class RoomService {
    constructor(@InjectRepository(Room) private roomRepo: Repository<Room>) {}

    findAll(): Promise<Room[]> {
        return this.roomRepo.find();
    }

    create(data: Partial<Room>): Promise<Room> {
        const room = this.roomRepo.create(data);
        return this.roomRepo.save(room);
    }
}
