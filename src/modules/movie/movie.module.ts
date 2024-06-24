import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Mongoose } from 'mongoose';
import { MovieReponsitory } from 'src/repositories/movie.reponsitory';
import { Movie, MovieScheme } from 'src/schemas/movie.schema';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Movie.name, schema: MovieScheme }]),
  ],
  providers: [MovieReponsitory, MovieService],
  controllers: [MovieController],
})
export class MovieModule {}
