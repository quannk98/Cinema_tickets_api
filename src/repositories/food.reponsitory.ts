import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EUserStatus } from 'src/common/enums/user.enum';
import { FoodDto } from 'src/modules/food/dto/food.dto';
import { Food } from 'src/schemas/food.schema';

@Injectable()
export class FoodReponsitory {
  constructor(
    @InjectModel(Food.name) private readonly foodModel: Model<Food>,
  ) {}
  async create(foodDto: FoodDto): Promise<any> {
    try {
      const exists = await this.foodModel.findOne({ name: foodDto.name });
      if (exists) throw new ConflictException('Food already exists');
      const createfood = new this.foodModel(foodDto);
      if (!createfood) throw new UnauthorizedException('Create Fail');
      await createfood.save();

      return createfood;
    } catch (error) {
      return error.message;
    }
  }

  async getAllFoodForAdmin(page: number): Promise<any> {
    const pageSize = 10;
    const skip = (page - 1) * pageSize;
    const getAll = await this.foodModel.find({}).skip(skip).limit(pageSize);
    return getAll;
  }

  async getAllFoodForUser(): Promise<any> {
    const getAll = await this.foodModel.find({status:EUserStatus.ACTIVE});
    return getAll;
  }
  async getFood(foodId: any): Promise<any> {
    const getFood = await this.foodModel.findById(foodId);
    if (!getFood) {
      return 'Get Failed';
    }
    return getFood;
  }

  async updateFood(foodId: any, dataUpdate: any): Promise<any> {
    const update = await this.foodModel.findByIdAndUpdate(foodId, dataUpdate, {
      new: true,
    });
    if (!update) {
      return 'Update Failed';
    }
    return update;
  }

  async updateStatusFood(foodId: any): Promise<any> {
    const food = await this.foodModel.findById(foodId);
    if (food.status === EUserStatus.ACTIVE) {
      const update = await this.foodModel.findByIdAndUpdate(
        foodId,
        { status: EUserStatus.INACTIVE },
        { new: true },
      );
      return update;
    } else {
      const update = await this.foodModel.findByIdAndUpdate(
        foodId,
        { status: EUserStatus.ACTIVE },
        { new: true },
      );
      return update;
    }
  }

  async deleteFood(foodId: any, password: any): Promise<any> {
    if (password != '8888') {
      return 'You do not have sufficient authority to delete';
    }
    const deletefood = await this.foodModel.findByIdAndDelete(foodId);
    if (!deletefood) {
      return 'Delete Failed';
    }
    return deletefood;
  }
}
