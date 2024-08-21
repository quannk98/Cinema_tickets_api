import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CinemaDto } from 'src/modules/cinema/dto/cinema.dto';
import { Cinema } from 'src/schemas/cinema.schema';

@Injectable()
export class CinemaReponsitory {
  constructor(
    @InjectModel(Cinema.name) private readonly cinemaModel: Model<Cinema>,
  ) {}
  async createCinema(cinemaDto: CinemaDto): Promise<any> {
    try {
      const existCinema = await this.cinemaModel.findOne({
        name: cinemaDto.name,
      });
      if (existCinema) throw new ConflictException('Cinema already exists');
      const createcinema = new this.cinemaModel(cinemaDto);
      if (!createcinema) throw new UnauthorizedException('Create Fail');
      createcinema.save();
      return createcinema;
    } catch (error) {
      return error.message;
    }
  }

  async getAllCinema(): Promise<any> {
  
    const getAll = await this.cinemaModel.find({});
    return getAll;
  }
  async getCinema(cinemaId: any): Promise<any> {
    const getcinema = await this.cinemaModel.findById(cinemaId);
    if (!getcinema) {
      return 'Get Failed';
    }
    return getcinema;
  }

  async updateCinema(cinemaId: any, dataUpdate: any): Promise<any> {
    const update = await this.cinemaModel.findByIdAndUpdate(
      cinemaId,
      dataUpdate,
      {
        new: true,
      },
    );
    if (!update) {
      return 'Update Failed';
    }

    return update;
  }

  async deleteCinema(cinemaId: any, password: any): Promise<any> {
    if (password != '8888') {
      return 'You do not have sufficient authority to delete';
    }
    const deletecinema = await this.cinemaModel.findByIdAndDelete(cinemaId);
    if (!deletecinema) {
      return 'Delete Failed';
    }

    return deletecinema;
  }
}
