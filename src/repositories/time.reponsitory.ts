import { ConflictException, Injectable } from '@nestjs/common';
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
      if (existstime) {
        return 'Time already exists';
      }
      const createtime = new this.timeModel(timeDto);
      if (!createtime) {
        return {
          status: 'error',
          message: 'Create Failed',
        };
      }
      return {
        data: createtime.save(),
        message: 'Successfully',
      };
    } catch (error) {
      return error.reponse;
    }
  }

  async getAlltime(): Promise<any> {
    const getAll = await this.timeModel.find({});
    return getAll;
  }
  async getTime(timeId: any): Promise<any> {
    const getTime = await this.timeModel.findById(timeId);
    if (!getTime) {
      return {
        status: 'error',
        message: 'Get Failed',
      };
    }
    return getTime;
  }

  async updateTime(timeId: any, dataUpdate: any): Promise<any> {
    const update = await this.timeModel.findByIdAndUpdate(timeId, dataUpdate, {
      new: true,
    });
    if (!update) {
      return {
        status: 'error',
        message: 'Update Failed',
      };
    }
    return update;
  }

  async deleteTime(timeId: any): Promise<any> {
    const deletetime = await this.timeModel.findByIdAndDelete(timeId);
    if (!deletetime) {
      return {
        status: 'error',
        message: 'Delete Failed',
      };
    }
    return deletetime;
  }
}
