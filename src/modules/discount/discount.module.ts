import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DiscountReponsitory } from 'src/repositories/discount.reponsitory';
import { Discount, DiscountSchema } from 'src/schemas/discount.schema';
import { DiscountService } from './discount.service';
import { DiscountController } from './discount.controller';

@Module({
    imports:[
        MongooseModule.forFeature([{name:Discount.name,schema:DiscountSchema}])
    ],
    providers:[DiscountReponsitory,DiscountService],
    controllers:[DiscountController]
})
export class DiscountModule {}
