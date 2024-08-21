import { Injectable } from '@nestjs/common';
import { FoodReponsitory } from 'src/repositories/food.reponsitory';
import { FoodDto } from './dto/food.dto';

@Injectable()
export class FoodService {
  constructor(private readonly foodReponsitory: FoodReponsitory) {}
  async createFood(foodDto: FoodDto): Promise<any> {
    const food = await this.foodReponsitory.create(foodDto);

    return food;
  }

  async getAllFoodForAdmin(page: number): Promise<any> {
    const getall = await this.foodReponsitory.getAllFoodForAdmin(page);
    return getall;
  }
  async getAllFoodForUser(): Promise<any> {
    const getall = await this.foodReponsitory.getAllFoodForUser();
    return getall;
  }
  async getfood(foodId: any): Promise<any> {
    const getFood = await this.foodReponsitory.getFood(foodId);
    return getFood;
  }

  async updateFood(foodId: any, dataUpdate): Promise<any> {
    const update = await this.foodReponsitory.updateFood(foodId, dataUpdate);
    return update;
  }

  async updateStatusFood(foodId: any): Promise<any> {
    const update = await this.foodReponsitory.updateStatusFood(foodId);
    return update;
  }

  async deleteFood(foodId: any, password: any): Promise<any> {
    const deleteFood = await this.foodReponsitory.deleteFood(foodId, password);
    return deleteFood;
  }
}
