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
<<<<<<< HEAD
import { Notification } from './notification/notification.entity';
=======
import {ExtractsModule} from "./extract/extract.module";
import {MinioModule} from "./minio/minio.module";
>>>>>>> origin/main

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'pguser',
      password: 'pgpass',
      database: 'pgdb',
      entities: [User, Notification],
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
<<<<<<< HEAD
    NotificationModule,
=======
    ExtractsModule,
    MinioModule,
>>>>>>> origin/main
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
