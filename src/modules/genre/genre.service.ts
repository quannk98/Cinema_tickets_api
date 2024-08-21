import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { GenreReponsitory } from 'src/repositories/genre.reponsitory';
import { GenreDto } from './dto/genre.dto';

@Injectable()
export class GenreService {
  constructor(private readonly genreReponsitory: GenreReponsitory) {}

  async Create(genreDto: GenreDto): Promise<any> {
    const create = await this.genreReponsitory.CreateGenre(genreDto);
    return create;
  }

  async getAllForAdmin(page:number): Promise<any> {
    const getall = await this.genreReponsitory.getAllForAdmin(page);
    return getall;
  }

  async getAllForUser(): Promise<any> {
    const getall = await this.genreReponsitory.getAllForUser();
    return getall;
  }
  
  async getGenre(genreId: any): Promise<any> {
    const getgenre = await this.genreReponsitory.getGenreById(genreId);
    return getgenre;
  }

  async updateGenre(genreId: any, data: any): Promise<any> {
    const update = await this.genreReponsitory.update(genreId, data);
    return update;
  }

  async deleteGenre(genreId: any,password:any): Promise<any> {
    const deletegenre = await this.genreReponsitory.deleteGenre(genreId,password);
    return deletegenre;
  }
}
