import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ShowtimeReponsitory } from 'src/repositories/showtime.reponsitory';
import { Showtime, ShowtimeSchema } from 'src/schemas/showtime.schema';
import { ShowtimeController } from './showtime.controller';
import { ShowtimeService } from './showtime.service';
import { Time, TimeSchema } from 'src/schemas/time.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Showtime.name, schema: ShowtimeSchema },
      { name: Time.name, schema: TimeSchema },
    ]),
  ],
  providers: [ShowtimeReponsitory, ShowtimeService],
  controllers: [ShowtimeController],
})
export class ShowTimeModule {}
