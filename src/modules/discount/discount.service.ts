import { Injectable } from '@nestjs/common';
import { DiscountReponsitory } from 'src/repositories/discount.reponsitory';
import { DiscountDto } from './dto/discount.dto';

@Injectable()
export class DiscountService {
  constructor(private readonly discountReponsitory: DiscountReponsitory) {}
  async createDiscount(discountDto: DiscountDto): Promise<any> {
    const discount = await this.discountReponsitory.create(discountDto);
    return discount;
  }

  async getAllForAdmin(page: number): Promise<any> {
    const getall = await this.discountReponsitory.getAllForAdmin(page);
    return getall;
  }
  async getAllForUser(): Promise<any> {
    const getall = await this.discountReponsitory.getAllForUser();
    return getall;
  }
  async getdiscount(discountId: any): Promise<any> {
    const getDiscount = await this.discountReponsitory.getDiscount(discountId);
    return getDiscount;
  }

  async getdiscountbytype(type: any): Promise<any> {
    const getDiscount = await this.discountReponsitory.getDiscountByType(type);
    return getDiscount;
  }
  async checkCodeDiscount(code: any, cinemaId: any): Promise<any> {
    const discount = await this.discountReponsitory.checkCodeDiscount(
      code,
      cinemaId,
    );
    return discount;
  }

  async updateDiscountStatus(discountId: any): Promise<any> {
    const update =
      await this.discountReponsitory.UpdateStatusDiscount(discountId);
    return update;
  }

  async updateDiscount(discountId: any, dataUpdate): Promise<any> {
    const update = await this.discountReponsitory.updateDiscount(
      discountId,
      dataUpdate,
    );
    return update;
  }

  async deleteDiscount(discountId: any, password: any): Promise<any> {
    const deleteDiscount = await this.discountReponsitory.deleteDiscount(
      discountId,
      password,
    );
    return deleteDiscount;
  }
}
