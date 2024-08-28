import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomReponsitory } from 'src/repositories/room.reponsitory';
import { Room, RoomSchema } from 'src/schemas/room.schema';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { Showtime, ShowtimeSchema } from 'src/schemas/showtime.schema';
import { Time, TimeSchema } from 'src/schemas/time.schema';
import { Movie, MovieScheme } from 'src/schemas/movie.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Room.name, schema: RoomSchema },
      { name: Showtime.name, schema: ShowtimeSchema },
      { name: Time.name, schema: TimeSchema },
      { name: Movie.name, schema: MovieScheme },
    ]),
  ],
  providers: [RoomReponsitory, RoomService],
  controllers: [RoomController],
})
export class RoomModule {}
