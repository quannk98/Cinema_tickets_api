import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomReponsitory } from 'src/repositories/room.reponsitory';
import { Room, RoomSchema } from 'src/schemas/room.schema';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { Showtime, ShowtimeSchema } from 'src/schemas/showtime.schema';
import { Time, TimeSchema } from 'src/schemas/time.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Room.name, schema: RoomSchema },
      { name: Showtime.name, schema: ShowtimeSchema },
      { name: Time.name, schema: TimeSchema },
    ]),
  ],
  providers: [RoomReponsitory, RoomService],
  controllers: [RoomController],
})
export class RoomModule {}
