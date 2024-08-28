import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MovieDto } from 'src/modules/movie/dto/movie.dto';
import { Movie } from 'src/schemas/movie.schema';

@Injectable()
export class MovieReponsitory {
  constructor(@InjectModel(Movie.name) readonly movieModel: Model<Movie>) {}
  async create(movieDto: MovieDto): Promise<any> {
    try {
      const existsMovie = await this.movieModel.findOne({
        name: movieDto.name,
      });
      if (existsMovie) throw new ConflictException('Movie already exists');

      const dataCreate = {
        ...movieDto,
        release_date: new Date(movieDto.release_date),
      };
      const create = new this.movieModel(dataCreate);
      if (!create) throw new UnauthorizedException('Create Fail');
      create.save();
      return create;
    } catch (error) {
      return error.message;
    }
  }
  async getAllmovieForAdmin(page: number): Promise<any> {
    const pageSize = 10;
    const skip = (page - 1) * pageSize;
    const getAll = await this.movieModel
      .find({})
      .populate([
        { path: 'genre', select: 'name image' },
        { path: 'director', select: 'name image' },
        { path: 'actor', select: 'name image' },
      ])
      .sort({ release_date: -1 })
      .skip(skip)
      .limit(pageSize);
    return getAll;
  }
  async getAllmovieForUser(): Promise<any> {
    const getAll = await this.movieModel
      .find({ release_status: { $ne: 'nc' } })
      .sort({ release_date: -1 })
      .populate([
        { path: 'genre', select: 'name image' },
        { path: 'director', select: 'name image' },
        { path: 'actor', select: 'name image' },
      ]);

    return getAll;
  }
  async getmovie(movieId: any): Promise<any> {
    const getMovie = await this.movieModel.findById(movieId).populate([
      { path: 'genre', select: 'name image' },
      { path: 'director', select: 'name image' },
      { path: 'actor', select: 'name image' },
    ]);
    if (!getMovie) {
      return 'Get Movie Failed';
    }
    return getMovie;
  }

  async getMovieByDirector(directorId: any): Promise<any> {
    const getMovieByDirector = await this.movieModel
      .find({
        release_status: { $ne: 'nc' },
        director: directorId,
      })
      .populate([
        { path: 'genre', select: 'name image' },
        { path: 'director', select: 'name image' },
        { path: 'actor', select: 'name image' },
      ]);
    if (!getMovieByDirector) {
      return 'Get Movie By Director Failed';
    }
    return getMovieByDirector;
  }

  async getMovieByActor(actorId: any): Promise<any> {
    const getMovie = await this.movieModel
      .find({ actor: actorId, release_status: { $ne: 'nc' } })
      .populate([
        { path: 'genre', select: 'name image' },
        { path: 'director', select: 'name image' },
        { path: 'actor', select: 'name image' },
      ]);
    if (!getMovie) {
      return 'Get Movie By Actor Failed';
    }
    return getMovie;
  }

  async checkMovie(): Promise<any> {
    try {
      const date = new Date(Date.now());
      const getMoviedc = await this.movieModel.find({
        release_date: { $lt: date },
        release_status: { $ne: 'nc' },
      });

      if (getMoviedc.length > 0) {
        for (const movie of getMoviedc) {
          await this.movieModel.findByIdAndUpdate(movie._id, {
            release_status: 'dc',
          });
        }
      }

      const getMoviesc = await this.movieModel.find({
        release_date: { $gt: date },
        release_status: { $ne: 'nc' },
      });

      if (getMoviesc.length > 0) {
        for (const movie of getMoviesc) {
          await this.movieModel.findByIdAndUpdate(movie._id, {
            release_status: 'sc',
          });
        }
      }
    } catch (error) {
      console.error('Error checking movies:', error.message);
    }
  }

  async searchMovie(name: string): Promise<any> {
    const regexResults = await this.movieModel.find({
      name: { $regex: new RegExp(name, 'i') },
    });

    return regexResults;
  }

  async getMovieByGenre(genreId: any): Promise<any> {
    const getMovie = await this.movieModel.find({
      genre: genreId,
      release_status: { $ne: 'nc' },
    });
    return getMovie;
  }

  async updateMovieStopShow(movieId: any): Promise<any> {
    try {
      const movie = await this.movieModel.findById(movieId);
      if (movie.release_status === 'nc') {
        const update = await this.movieModel.findByIdAndUpdate(
          movieId,
          {
            release_status: 'sc',
          },
          {
            new: true,
          },
        );

        if (!update) {
          return 'Update Failed';
        }
      } else {
        const update = await this.movieModel.findByIdAndUpdate(
          movieId,
          {
            release_status: 'nc',
          },
          {
            new: true,
          },
        );

        if (!update) {
          return 'Update Failed';
        }
        return update;
      }
    } catch (error) {
      console.log('error', error.response);
    }
  }

  async update(movieId: any, dataUpdate: any): Promise<any> {
    try {
      const update = await this.movieModel.findByIdAndUpdate(
        movieId,
        dataUpdate,
        {
          new: true,
        },
      );

      if (!update) {
        return 'Update Failed';
      }

      return update;
    } catch (error) {
      console.log('error', error.response);
    }
  }

  async delete(movieId: any, password: any): Promise<any> {
    if (password != '8888') {
      return 'You do not have sufficient authority to delete';
    }
    const deletemovie = await this.movieModel.findByIdAndDelete(movieId);
    if (!deletemovie) {
      return 'Delete Failed';
    }
    return deletemovie;
  }
}
