import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ShowtimeDto } from 'src/modules/show_time/dto/showtime.dto';
import { Showtime } from 'src/schemas/showtime.schema';

@Injectable()
export class ShowtimeReponsitory {
  constructor(
    @InjectModel(Showtime.name) private readonly showtimeModel: Model<Showtime>,
  ) {}
  async createShowtime(showtimeDto: ShowtimeDto): Promise<any> {
    try {
      const existShowtime = await this.showtimeModel.findOne({
        movie: showtimeDto.movie,
        date: new Date(showtimeDto.date),
      });

      if (existShowtime)
        throw new ConflictException('Show time already exists');
      const dateCreate = {
        ...showtimeDto,
        date: new Date(showtimeDto.date),
      };
      const createshowtime = new this.showtimeModel(dateCreate);
      if (!createshowtime) throw new UnauthorizedException('Create Fail');
      createshowtime.save();
      return createshowtime;
    } catch (error) {
      return error.message;
    }
  }

  async getAllShowtime(page: number): Promise<any> {
    const pageSize = 10;
    const skip = (page - 1) * pageSize;
    const getAll = await this.showtimeModel
      .find({})
      .populate([{ path: 'time', select: 'time' }])
      .skip(skip)
      .limit(pageSize);
    return getAll;
  }

  async getAllShowtimeUser(): Promise<any> {
    const getAll = await this.showtimeModel
      .find({})
      .populate([{ path: 'time', select: 'time' }]);
    return getAll;
  }

  async getShowtime(showtimeId: any): Promise<any> {
    const getshowtime = await this.showtimeModel
      .findById(showtimeId)
      .populate([{ path: 'time', select: 'time' }]);
    if (!getshowtime) {
      return 'Get Failed';
    }
    return getshowtime;
  }

  async updateShowtime(showtimeId: any, dataUpdate: any): Promise<any> {
    const dataupdate = {
      ...dataUpdate,
      date: dataUpdate.date,
    };
    const update = await this.showtimeModel.findByIdAndUpdate(
      showtimeId,
      dataupdate,
      {
        new: true,
      },
    );

    if (!update) {
      return 'Update Failed';
    }
    return update;
  }

  async checkShowtime(): Promise<any> {
    const today = new Date();
    const deletedCount = await this.showtimeModel.deleteMany({
      date: { $lt: today },
    });

    return deletedCount;
  }

  async deleteShowtime(showtimeId: any, password: any): Promise<any> {
    if (password != '8888') {
      return 'You do not have sufficient authority to delete';
    }
    const deleteshow = await this.showtimeModel.findByIdAndDelete(showtimeId);
    if (!deleteshow) {
      return 'Delete Failed';
    }
    return deleteshow;
  }
}
