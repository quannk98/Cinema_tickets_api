import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Time } from 'src/schemas/time.schema';
import { TimeDto } from '../modules/time/dto/time.dto';

@Injectable()
export class TimeReponsitory {
  constructor(
    @InjectModel(Time.name) private readonly timeModel: Model<Time>,
  ) {}
  async create(timeDto: TimeDto): Promise<any> {
    try {
      const existstime = await this.timeModel.findOne({ time: timeDto.time });
      if (existstime) throw new ConflictException('Time already exists');
      const createtime = new this.timeModel(timeDto);
      if (!createtime) throw new UnauthorizedException('Create Fail');
      createtime.save();
      return createtime;
    } catch (error) {
      return error.message;
    }
  }

  async getAlltime(page: number): Promise<any> {
    const pageSize = 10;
    const skip = (page - 1) * pageSize;
    const getAll = await this.timeModel.find({}).skip(skip).limit(pageSize);
    return getAll;
  }

  async getAlltimeNoPage(): Promise<any> {
    const getAll = await this.timeModel.find({});
    return getAll;
  }
  async getTime(timeId: any): Promise<any> {
    const getTime = await this.timeModel.findById(timeId);
    if (!getTime) {
      return 'Get Failed';
    }
    return getTime;
  }

  async updateTime(timeId: any, dataUpdate: any): Promise<any> {
    const update = await this.timeModel.findByIdAndUpdate(timeId, dataUpdate, {
      new: true,
    });
    if (!update) {
      return 'Update Failed';
    }
    return update;
  }

  async deleteTime(timeId: any, password: any): Promise<any> {
    if (password != '8888') {
      return 'You do not have sufficient authority to delete';
    }
    const deletetime = await this.timeModel.findByIdAndDelete(timeId);
    if (!deletetime) {
      return 'Delete Failed';
    }
    return deletetime;
  }
}
