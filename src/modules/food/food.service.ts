import { Injectable } from "@nestjs/common";
import { FoodReponsitory } from "src/repositories/food.reponsitory";
import { FoodDto } from "./dto/food.dto";

@Injectable()
export class FoodService{
    constructor(private readonly foodReponsitory:FoodReponsitory){}
    async createFood(foodDto:FoodDto): Promise<any> {
     
        const food = await this.foodReponsitory.create(foodDto);
       
        return food;
      }
    
      async getAll(): Promise<any> {
        const getall = await this.foodReponsitory.getAll();
        return getall;
      }
      async getfood(foodId: any): Promise<any> {
        const getFood = await this.foodReponsitory.getFood(foodId);
        return getFood;
      }

    
      async updateFood(foodId: any, dataUpdate): Promise<any> {
        const update = await this.foodReponsitory.updateFood(foodId,dataUpdate
         );
        return update;
      }
    
      async deleteFood(foodId: any): Promise<any> {
        const deleteFood = await this.foodReponsitory.deleteFood(foodId);
        return deleteFood;
      }
}