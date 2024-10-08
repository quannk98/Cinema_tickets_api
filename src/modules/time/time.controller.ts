import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
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
  async getAll(@Query('page') page: number): Promise<any> {
    const getall = await this.timeService.getAlltime(page);
    return {
      getall,
    };
  }

  @UseGuards(AuthAdminGuard)
  @Get('user')
  async getAlltimeNoPage(): Promise<any> {
    const getall = await this.timeService.getAlltimeNoPage();
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
  async deleteTime(
    @Param('id') id: any,
    @Query('password') password: any,
  ): Promise<any> {
    const deletetime = await this.timeService.deleteTime(id, password);
    await this.timeService.deleteTime(id, password);
    return {
      deletetime,
    };
  }
}
