import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { EmailModule } from './modules/email/email.module';
import { DirectorModule } from './modules/director/director.module';
import { ActorModule } from './modules/actor/actor.module';
import { CinemaModule } from './modules/cinema/cinema.module';
import { SeatModule } from './modules/seat/seat.module';
import { ShowTimeModule } from './modules/show_time/show_time.module';
import { MovieModule } from './modules/movie/movie.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { RoomModule } from './modules/room/room.module';
import { TimeModule } from './modules/time/time.module';
import { DiscountModule } from './modules/discount/discount.module';
import { FoodModule } from './modules/food/food.module';
import { TicketModule } from './modules/ticket/ticket.module';
import { SeatstatusModule } from './modules/seatstatus/seatstatus.module';
import { GenreModule } from './modules/genre/genre.module';
import { NotificationModule } from './modules/notification/notification.module';
import { AppGateway } from './app.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import * as admin from 'firebase-admin';
import * as path from 'path';
import { FcmNotificationService } from './modules/firebase_notification/firebase.service';

// const cwd = process.cwd();
// const serviceAccountPath = path.join(cwd, 'public/serviceAccount.json');
// // const serviceAccount = require("../public/serviceAccount.json")

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccountPath),
// });

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(
      'mongodb://adminroot:airblade2016@139.180.132.97:27017/ticket_cinema_api?authSource=admin',
      {
        //mongodb://adminroot:airblade2016@139.180.132.97:27017/ticket_cinema_api?authSource=admin  //mongodb://localhost:27017/cinema_ticket_api
        connectTimeoutMS: 3000,
        socketTimeoutMS: 3000,
      },
    ),
   
    AuthModule,
    EmailModule,
    DirectorModule,
    ActorModule,
    CinemaModule,
    SeatModule,
    ShowTimeModule,
    MovieModule,
    RoomModule,
    TimeModule,
    DiscountModule,
    FoodModule,
    TicketModule,
    SeatstatusModule,
    GenreModule,
    NotificationModule,
    AppGateway,
   
  ],
  controllers: [AppController],
  providers: [AppService,FcmNotificationService
  ],
})
export class AppModule {}
