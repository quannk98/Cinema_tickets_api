import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { TimeDto } from './dto/time.dto';
import { TimeService } from './time.service';
import { AuthAdminGuard } from '../auth/dto/admin.guard';
import { AuthGuard } from '../auth/auth.guard';

@Controller('times')
export class TimeController {
  constructor(private readonly timeService: TimeService) {}

  @UseGuards(AuthAdminGuard)
  @Post('')
  async create(@Body() timeDto: TimeDto): Promise<any> {
    try {
      const create = await this.timeService.createTime(timeDto);
      return {
        create,
      };
    } catch (error) {
      return error.reponse;
    }
  }

  @UseGuards(AuthAdminGuard)
  @Get('')
  async getAll(): Promise<any> {
    const getall = await this.timeService.getAlltime();
    return {
      getall,
    };
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getTime(@Param('id') id: any): Promise<any> {
    const getTime = await this.timeService.gettime(id);
    return {
      getTime,
    };
  }

  
  @UseGuards(AuthAdminGuard)
  @Put(':id')
  async update(@Param('id') id: any, @Body() timeDto: TimeDto): Promise<any> {
    try {
      const updated = await this.timeService.updateTime(id, timeDto);
      return {
        updated,
      };
    } catch (error) {
      return error.reponse;
    }
  }

  @UseGuards(AuthAdminGuard)
  @Delete(':id')
  async deleteTime(@Param('id') id: any): Promise<any> {
    const deletetime = await this.timeService.deleteTime(id);
    await this.timeService.deleteTime(id);
    return {
      deletetime,
    };
  }
}
