import {  HttpServer, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationReponsitory } from 'src/repositories/notification.reponsitory';
import {
  Notification,
  NotificationSchema,
} from 'src/schemas/notification.schema';
import { User, UserSchema } from 'src/schemas/user.schema';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { ScheduleModule } from '@nestjs/schedule';
import * as admin from 'firebase-admin';
import * as path from 'path';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
      { name: User.name, schema: UserSchema },
    ]),
    ScheduleModule.forRoot(),
  ],
  providers: [
    NotificationReponsitory,
    NotificationService,
   
  ],
  controllers: [NotificationController],
})
export class NotificationModule {}
