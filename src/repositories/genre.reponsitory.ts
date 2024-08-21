import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GenreDto } from 'src/modules/genre/dto/genre.dto';
import { Genre } from 'src/schemas/genre.schema';

@Injectable()
export class GenreReponsitory {
  constructor(
    @InjectModel(Genre.name) private readonly modelGenre: Model<Genre>,
  ) {}

  async CreateGenre(genreDto: GenreDto): Promise<any> {
    try {
      const exist = await this.modelGenre.findOne({
        name: genreDto.name,
      });
      if (exist) throw new ConflictException('Room already exists');

      const create = new this.modelGenre(genreDto);
      if (!create) throw new UnauthorizedException('Create Fail');
      await create.save();

      return create;
    } catch (error) {
      error.message;
    }
  }

  async getAllForAdmin(page:number): Promise<any> {
    const pageSize = 10;
    const skip = (page - 1) * pageSize;
    const getall = await this.modelGenre.find({})
    .skip(skip)
    .limit(pageSize);
    return getall;
  }

  async getAllForUser(): Promise<any> {   
    const getall = await this.modelGenre.find({})
    return getall;
  }


  async getGenreById(genreId: any): Promise<any> {
    const getgenre = await this.modelGenre.findById(genreId);

    if (!getgenre) throw new UnauthorizedException('genre not available');
    return getgenre;
  }

  async update(genreId: any, data: any): Promise<any> {
    const update = await this.modelGenre.findByIdAndUpdate(genreId, data, {
      new: true,
    });
    if (!update) throw new UnauthorizedException('error update');

    return update;
  }

  async deleteGenre(genreId: any,password:any): Promise<any> {
    if(password != "8888"){
      return "You do not have sufficient authority to delete"
     }
    const deletegenre = await this.modelGenre.findByIdAndDelete(genreId);
    if (!deletegenre) throw new UnauthorizedException('error delete');
    return deletegenre;
  }
}
