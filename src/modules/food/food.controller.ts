import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FoodService } from './food.service';
import { AuthAdminGuard } from '../auth/dto/admin.guard';
import { FoodDto } from './dto/food.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AuthGuard } from '../auth/auth.guard';

@Controller('foods')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}
  @UseGuards(AuthAdminGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './public/images',
        filename: (req, file, cb) => {
          const filename = file.originalname;
          cb(null, `${filename}`);
        },
      }),
    }),
  )
  @Post('')
  async create(
    @Body() foodDto: FoodDto,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<any> {
    try {
      if (image === undefined) {
        const create = await this.foodService.createFood(foodDto);
        return {
          create,
        };
      }
      const dataCreate = {
        ...foodDto,
        image: image.filename,
      };

      const create = await this.foodService.createFood(dataCreate);
      return {
        create,
      };
    } catch (error) {
      console.log('error', error.reponse);
    }
  }

  @UseGuards(AuthAdminGuard)
  @Get('admin')
  async getAllFoodForAdmin(@Query('page') page: number): Promise<any> {
    const getall = await this.foodService.getAllFoodForAdmin(page);
    return {
      getall,
    };
  }

  @UseGuards(AuthGuard)
  @Get('user')
  async getAllFoodForuser(): Promise<any> {
    const getall = await this.foodService.getAllFoodForUser();
    return {
      getall,
    };
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getFoodUser(@Param('id') id: any): Promise<any> {
    const getFood = await this.foodService.getfood(id);
    return {
      getFood,
    };
  }

  @UseGuards(AuthAdminGuard)
  @Put(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './public/images',
        filename: (req, file, cb) => {
          const filename = file.originalname;
          cb(null, `${filename}`);
        },
      }),
    }),
  )
  async update(
    @Param('id') id: any,
    @Body() foodDto: FoodDto,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<any> {
    try {
      if (image === undefined) {
        const updated = await this.foodService.updateFood(id, foodDto);
        return {
          updated,
        };
      } else {
        const dataUpdate = {
          ...foodDto,
          image: image.filename,
        };
        const updated = await this.foodService.updateFood(id, dataUpdate);
        return {
          updated,
        };
      }
    } catch (error) {
      return error.reponse;
    }
  }

  @UseGuards(AuthAdminGuard)
  @Put('status/:id')
  async updateStatusFood(@Param('id') id: any): Promise<any> {
    const update = await this.foodService.updateStatusFood(id);
    return update;
  }

  @UseGuards(AuthAdminGuard)
  @Delete(':id')
  async deleteFood(
    @Param('id') id: any,
    @Query('password') password: any,
  ): Promise<any> {
    const deletetime = await this.foodService.deleteFood(id, password);
    await this.foodService.deleteFood(id, password);
    return {
      deletetime,
    };
  }
}
