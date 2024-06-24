import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { get } from 'http';
import { Model } from 'mongoose';
import { DiscountDto } from 'src/modules/discount/dto/discount.dto';
import { Discount } from 'src/schemas/discount.schema';

@Injectable()
export class DiscountReponsitory {
  constructor(
    @InjectModel(Discount.name) private readonly discountModel: Model<Discount>,
  ) {}
  async create(discountDto: DiscountDto): Promise<any> {
    try {
      const existsdiscount = await this.discountModel.findOne({
        name: discountDto.name,
      });
      if (existsdiscount) {
        return 'Discount already exists';
      }
      const creatediscount = new this.discountModel(discountDto);
      if (!creatediscount) {
        return {
          status: 'error',
          message: 'Create Failed',
        };
      }
      return {
        data: creatediscount.save(),
        message: 'Successfully',
      };
    } catch (error) {
      return error.reponse;
    }
  }

  async getAll(): Promise<any> {
    const getAll = await this.discountModel
      .find({})
      .populate([{ path: 'cinema', select: 'name address hotline' }]);
    return getAll;
  }
  async getDiscount(discountId: any): Promise<any> {
    const getDiscount = await this.discountModel
      .findById(discountId)
      .populate([{ path: 'cinema', select: 'name address hotline' }]);
    if (!getDiscount) {
      return {
        status: 'error',
        message: 'Get Failed',
      };
    }
    return getDiscount;
  }

  async getDiscountByType(type: any): Promise<any> {
    const getDiscount = await this.discountModel
      .find({ type: type })
      .populate([{ path: 'cinema', select: 'name address hotline' }]);
    if (!getDiscount) {
      return {
        status: 'error',
        message: 'Get Failed',
      };
    }
    return getDiscount;
  }

  async updateDiscount(discountId: any, dataUpdate: any): Promise<any> {
    const update = await this.discountModel.findByIdAndUpdate(
      discountId,
      dataUpdate,
      {
        new: true,
      },
    );
    if (!update) {
      return {
        status: 'error',
        message: 'Update Failed',
      };
    }
    return update;
  }

  async deleteDiscount(discountId: any): Promise<any> {
    const deletediscount =
      await this.discountModel.findByIdAndDelete(discountId);
    if (!deletediscount) {
      return {
        status: 'error',
        message: 'Delete Failed',
      };
    }
    return deletediscount;
  }
}
