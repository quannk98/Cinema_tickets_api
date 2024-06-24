import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FoodReponsitory } from 'src/repositories/food.reponsitory';
import { Food, FoodSchema } from 'src/schemas/food.schema';
import { FoodService } from './food.service';
import { FoodController } from './food.controller';

@Module({
    imports:[MongooseModule.forFeature([{name:Food.name,schema:FoodSchema}])],
    providers:[FoodReponsitory,FoodService],
    controllers:[FoodController]
})
export class FoodModule {}
