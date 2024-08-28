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
import { DiscountService } from './discount.service';
import { AuthAdminGuard } from '../auth/dto/admin.guard';
import { DiscountDto } from './dto/discount.dto';
import { AuthGuard } from '../auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
function generateRandomCode(length: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

@Controller('discounts')
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  @UseGuards(AuthAdminGuard)
  @Post('')
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
  async create(
    @Body() discountDto: DiscountDto,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<any> {
    try {
      if (image === undefined) {
        return 'Found Image';
      }
      if (discountDto.cinema === undefined) {
        return 'Error Not Cinema';
      }
      console.log('11', discountDto.cinema);
      const dataCreate = {
        ...discountDto,
        // cinema: JSON.parse(discountDto.cinema),
        code: generateRandomCode(6),
        image: image.filename,
      };
      const create = await this.discountService.createDiscount(dataCreate);
      return {
        create,
      };
    } catch (error) {
      return error.reponse;
    }
  }

  @UseGuards(AuthAdminGuard)
  @Get('type')
  async getType(@Query('type') type: any): Promise<any> {
    const getDiscount = await this.discountService.getdiscountbytype(type);
    return {
      getDiscount,
    };
  }

  @UseGuards(AuthAdminGuard)
  @Put('status/:id')
  async UpdateStatusDiscount(@Param('id') id: any): Promise<any> {
    const update = await this.discountService.updateDiscountStatus(id);
    return update;
  }

  @UseGuards(AuthGuard)
  @Get('check/code')
  async checkCodeDiscount(
    @Query('code') code: any,
    @Query('cinemaId') cinemaId: any,
  ): Promise<any> {
    const discount = await this.discountService.checkCodeDiscount(
      code,
      cinemaId,
    );
    return discount;
  }

  @UseGuards(AuthAdminGuard)
  @Get('admin')
  async getAllForAdmin(@Query('page') page: number): Promise<any> {
    const getall = await this.discountService.getAllForAdmin(page);
    return {
      getall,
    };
  }

  @UseGuards(AuthGuard)
  @Get('user')
  async getAllForUser(): Promise<any> {
    const getall = await this.discountService.getAllForUser();
    return {
      getall,
    };
  }

  @Get('no/login')
  async getAllNoLogin(): Promise<any> {
    const getall = await this.discountService.getAllForUser();
    return {
      getall,
    };
  }

  @Get('no/login/:id')
  async getDiscountNoLogin(@Param('id') id: any): Promise<any> {
    const getDiscount = await this.discountService.getdiscount(id);
    return {
      getDiscount,
    };
  }
  @UseGuards(AuthGuard)
  @Get(':id')
  async getDiscount(@Param('id') id: any): Promise<any> {
    const getDiscount = await this.discountService.getdiscount(id);
    return {
      getDiscount,
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
    @Body() discountDto: DiscountDto,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<any> {
    try {
      if (image === undefined) {
        const updated = await this.discountService.updateDiscount(
          id,
          discountDto,
        );
        return {
          updated,
        };
      } else {
        const dataUpdate = {
          ...discountDto,
          image: image.filename,
        };
        const updated = await this.discountService.updateDiscount(
          id,
          dataUpdate,
        );
        return {
          updated,
        };
      }
    } catch (error) {
      return error.reponse;
    }
  }

  @UseGuards(AuthAdminGuard)
  @Delete(':id')
  async deleteDisount(
    @Param('id') id: any,
    @Query('password') password: any,
  ): Promise<any> {
    const deletediscount = await this.discountService.deleteDiscount(
      id,
      password,
    );
    await this.discountService.deleteDiscount(id, password);
    return {
      deletediscount,
    };
  }
}
