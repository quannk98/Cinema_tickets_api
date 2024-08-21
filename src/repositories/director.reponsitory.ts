import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DirectorDto } from 'src/modules/director/dto/director.dto';
import { Director } from 'src/schemas/directors.schema';

@Injectable()
export class DirectorsReponsitory {
  constructor(
    @InjectModel(Director.name) private readonly directorModel: Model<Director>,
  ) {}

  async createDirectorDto(directorDto: DirectorDto): Promise<any> {
    try {
      const existsDirector = await this.directorModel.findOne({
        name: directorDto.name,
      });
      if (existsDirector)
        throw new ConflictException('Director already exists');

      const createDirector = new this.directorModel(directorDto);
      if (!createDirector) throw new UnauthorizedException('Create Fail');
      createDirector.save();
      return createDirector;
    } catch (error) {
      error.message;
    }
  }

  async getAlldirector(page: number): Promise<any> {
    const pageSize = 10;
    const skip = (page - 1) * pageSize;
    const getAll = await this.directorModel.find({}).skip(skip).limit(pageSize);
    return getAll;
  }

  async getAlldirectorNoPage(): Promise<any> {
    const getAll = await this.directorModel.find({});
    return getAll;
  }

  async getdirector(directorId: any): Promise<any> {
    const getDirector = await this.directorModel.findById(directorId);
    if (!getDirector) {
      return 'Get Failed';
    }
    return getDirector;
  }

  async updateDirector(directorId: any, dataUpdate: any): Promise<any> {
    const update = await this.directorModel.findByIdAndUpdate(
      directorId,
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

  async deleteDirector(directorId: any, password: any): Promise<any> {
    if (password != '8888') {
      return 'You do not have sufficient authority to delete';
    }
    const deletedirector =
      await this.directorModel.findByIdAndDelete(directorId);
    if (!deletedirector) {
      return 'Delete Failed';
    }
    return deletedirector;
  }
}
