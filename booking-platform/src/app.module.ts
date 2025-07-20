import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { APP_GUARD } from '@nestjs/core';
import { RoomModule } from './room/room.module';
import { ReservationModule } from './reservation/reservation.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { NotificationModule } from './notification/notification.module';
import { JwtStrategy } from './auth/jwt-strategy';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import {User} from "./user/user.entity";
import { Notification } from './notification/notification.entity';
import { Room } from './room/room.entity';
import { Reservation } from './reservation/reservation.entity';
import {ExtractsModule} from "./extract/extract.module";
import {MinioModule} from "./minio/minio.module";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST || 'localhost',
      port: parseInt(process.env.POSTGRES_PORT || '5432'),
      username: process.env.POSTGRES_USER || 'pguser',
      password: process.env.POSTGRES_PASSWORD || 'pgpass',
      database: process.env.POSTGRES_DB || 'pgdb',
      entities: [User, Notification, Room, Reservation],
      autoLoadEntities: true,
      synchronize: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      context: ({ req }) => ({ req }),
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    RoomModule,
    ReservationModule,
    UserModule,
    AuthModule,
    NotificationModule,
    ExtractsModule,
    MinioModule,
  ],
  providers: [
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
