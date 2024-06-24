import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MovieDto } from 'src/modules/movie/dto/movie.dto';
import { Movie } from 'src/schemas/movie.schema';

@Injectable()
export class MovieReponsitory {
  constructor(@InjectModel(Movie.name) readonly movieModel: Model<Movie>) {}
  async create(movieDto: MovieDto): Promise<any> {
    const existsMovie = await this.movieModel.findOne({ name: movieDto.name });
    if (existsMovie) {
      return 'Movie already exists';
    }
    const dataCreate = {
      ...movieDto,
      release_date: new Date(movieDto.release_date),
    };
    const create = new this.movieModel(dataCreate);
    if (!create) {
      return {
        status: 'error',
        message: 'Create Movie Failed',
      };
    }
    return {
      data: create.save(),
      message: 'Successfully',
    };
  }
  async getAllmovie(): Promise<any> {
    const getAll = await this.movieModel.find({}).populate([
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
      return {
        status: 'error',
        message: 'Get Movie Failed',
      };
    }
    return getMovie;
  }

  async getMovieByDirector(directorId: any): Promise<any> {
    const getMovieByDirector = await this.movieModel
      .find({
        director: directorId,
      })
      .populate([
        { path: 'genre', select: 'name image' },
        { path: 'director', select: 'name image' },
        { path: 'actor', select: 'name image' },
      ]);
    if (!getMovieByDirector) {
      return {
        status: 'error',
        message: 'Get Movie By Director Failed',
      };
    }
    return getMovieByDirector;
  }

  async getMovieByActor(actorId: any): Promise<any> {
    const getMovie = await this.movieModel.find({ actor: actorId }).populate([
      { path: 'genre', select: 'name image' },
      { path: 'director', select: 'name image' },
      { path: 'actor', select: 'name image' },
    ]);
    if (!getMovie) {
      return {
        status: 'error',
        message: 'Get Movie By Actor Failed',
      };
    }
    return getMovie;
  }

  async checkMovie(): Promise<any> {
    try {
      const date = new Date(Date.now());
      const getMoviedc = await this.movieModel.find({
        release_date: { $lt: date },
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

  async getMovieByGenre(genre: any): Promise<any> {
    const getMovie = await this.movieModel.find({ genre: genre });
    return getMovie;
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
        return {
          status: 'error',
          message: 'Update Failed',
        };
      }
     
      return update;
    } catch (error) {
      console.log('error',error.response)
    }
  
  }

  async delete(movieId: any): Promise<any> {
    const deletemovie = await this.movieModel.findByIdAndDelete(movieId);
    if (!deletemovie) {
      return {
        status: 'error',
        message: 'Delete Failed',
      };
    }
    return deletemovie;
  }
}
