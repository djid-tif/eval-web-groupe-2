import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from '../reservation/reservation.entity';
import { ExtractsService } from './extract.service';
import { ExtractsController } from './extract.controller';
import { MinioModule } from '../minio/minio.module';

@Module({
    imports: [TypeOrmModule.forFeature([Reservation]), MinioModule],
    controllers: [ExtractsController],
    providers: [ExtractsService],
    exports: [ExtractsService],
})
export class ExtractsModule {}