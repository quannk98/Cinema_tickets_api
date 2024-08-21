import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ActorDto } from 'src/modules/actor/dto/actor.dto';
import { Actor } from 'src/schemas/actor.schema';

@Injectable()
export class ActorReponsitory {
  constructor(
    @InjectModel(Actor.name) private readonly actorModel: Model<Actor>,
  ) {}
  async createActor(actorDto: ActorDto): Promise<any> {
    try {
      const existsActor = await this.actorModel.findOne({
        name: actorDto.name,
      });
      if (existsActor) throw new ConflictException('Actor already exists');
      const createActor = new this.actorModel(actorDto);
      if (!createActor) throw new UnauthorizedException('Create Fail');
      createActor.save();
      return createActor;
    } catch (error) {
      return error.message;
    }
  }

  async getAllactor(page: number): Promise<any> {
    const pageSize = 10;
    const skip = (page - 1) * pageSize;
    const getAll = await this.actorModel.find({}).skip(skip).limit(pageSize);
    return getAll;
  }

  async getAllactorNoPage(): Promise<any> {
    const getAll = await this.actorModel.find({});
    return getAll;
  }

  async getactor(actorId: any): Promise<any> {
    const getActor = await this.actorModel.findById(actorId);
    if (!getActor) {
      return 'Get Failed';
    }
    return getActor;
  }

  

  async updateActor(actorId: any, dataUpdate: any): Promise<any> {
    const update = await this.actorModel.findByIdAndUpdate(
      actorId,
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

  async deleteActor(actorId: any, password: any): Promise<any> {
    if (password != '8888') {
      return 'You do not have sufficient authority to delete';
    }
    const deleteactor = await this.actorModel.findByIdAndDelete(actorId);
    if (!deleteactor) {
      return 'Delete Failed';
    }
    return deleteactor;
  }
}
