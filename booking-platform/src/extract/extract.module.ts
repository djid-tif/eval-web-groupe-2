import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from '../reservation/reservation.entity';
import { ExtractsService } from './extract.service';
import { ExtractsController } from './extract.controller';
import { MinioModule } from '../minio/minio.module';
import {ExtractsGrpcService} from "./extracts.grpc.service";

@Module({
    imports: [TypeOrmModule.forFeature([Reservation]), MinioModule],
    controllers: [ExtractsController],
    providers: [ExtractsService,ExtractsGrpcService],
    exports: [ExtractsService],
})
export class ExtractsModule {}