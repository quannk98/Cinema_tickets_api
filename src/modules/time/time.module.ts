import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TimeReponsitory } from 'src/repositories/time.reponsitory';
import { Time, TimeSchema } from 'src/schemas/time.schema';
import { TimeService } from './time.service';
import { TimeController } from './time.controller';

@Module({
    imports:[MongooseModule.forFeature([{name:Time.name,schema:TimeSchema}])],
    providers:[TimeReponsitory,TimeService],
    controllers:[TimeController]
})

export class TimeModule {}
