import { Injectable } from '@nestjs/common';
import { MovieReponsitory } from 'src/repositories/movie.reponsitory';
import { MovieDto } from './dto/movie.dto';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class MovieService {
  constructor(private readonly movieReponsitory: MovieReponsitory) {}
  async create(movieDto: MovieDto): Promise<any> {
    const createMovie = await this.movieReponsitory.create(movieDto);
    return createMovie.data;
  }

  async getAll(): Promise<any> {
    const getAll = await this.movieReponsitory.getAllmovie();
    return getAll;
  }
  async getMovie(movieId: any): Promise<any> {
    const getmovie = await this.movieReponsitory.getmovie(movieId);
    return getmovie;
  }
  async getMovieByDirector(directorId: any): Promise<any> {
    const getMovie = await this.movieReponsitory.getMovieByDirector(directorId);
    return getMovie;
  }

  async getMovieByActor(actorId: any): Promise<any> {
    const getMovie = await this.movieReponsitory.getMovieByActor(actorId);
    return getMovie;
  }

  async searchMovie(name: any): Promise<any> {
    const search = await this.movieReponsitory.searchMovie(name);
    return search;
  }

  async getMovieBygenre(genre: any): Promise<any> {
    const getMovie = await this.movieReponsitory.getMovieByGenre(genre);
    return getMovie;
  }

  @Cron('45 * * * * *')
  async checkMovie(): Promise<any> {
    await this.movieReponsitory.checkMovie();
  }

  async update(movieId: any, dataUpdate: any): Promise<any> {
    
    const updatemovie = await this.movieReponsitory.update(movieId, dataUpdate);
  
    return updatemovie;
  }

  async delete(movieId: any): Promise<any> {
    const deletemovie = await this.movieReponsitory.delete(movieId);
    return deletemovie;
  }
}
