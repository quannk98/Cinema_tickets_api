import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
      if (exists) {
        return 'Food already exists';
      }
      const createfood = new this.foodModel(foodDto);
      await createfood.save();
      if (!createfood) {
        return {
          status: 'error',
          message: 'Create Failed',
        };
      }
      return createfood;
    } catch (error) {
      return error.reponse;
    }
  }

  async getAll(): Promise<any> {
    const getAll = await this.foodModel.find({});
    return getAll;
  }
  async getFood(foodId: any): Promise<any> {
    const getFood = await this.foodModel.findById(foodId);
    if (!getFood) {
      return {
        status: 'error',
        message: 'Get Failed',
      };
    }
    return getFood;
  }

  async updateFood(foodId: any, dataUpdate: any): Promise<any> {
    const update = await this.foodModel.findByIdAndUpdate(foodId, dataUpdate, {
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

  async deleteFood(foodId: any): Promise<any> {
    const deletefood = await this.foodModel.findByIdAndDelete(foodId);
    if (!deletefood) {
      return {
        status: 'error',
        message: 'Delete Failed',
      };
    }
    return deletefood;
     
    
  }
}
