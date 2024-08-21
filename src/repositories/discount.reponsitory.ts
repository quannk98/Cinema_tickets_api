import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  EDiscountStatus,
  ENotificationType,
  ESeatStatus,
  EUserStatus,
} from 'src/common/enums/user.enum';
import { DiscountDto } from 'src/modules/discount/dto/discount.dto';
import { Discount } from 'src/schemas/discount.schema';
import { Notification } from 'src/schemas/notification.schema';

@Injectable()
export class DiscountReponsitory {
  constructor(
    @InjectModel(Discount.name) private readonly discountModel: Model<Discount>,
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<Notification>,
  ) {}
  async create(discountDto: DiscountDto): Promise<any> {
    try {
      const existsdiscount = await this.discountModel.findOne({
        name: discountDto.name,
      });
      if (existsdiscount)
        throw new ConflictException('Discount already exists');
      if (
        discountDto.dayStart === undefined ||
        discountDto.dayEnd === undefined
      ) {
        return 'Missing Date';
      }
      const dataCreate = {
        ...discountDto,
        dayStart: new Date(discountDto.dayStart),
        dayEnd: new Date(discountDto.dayEnd),
      };
      const creatediscount = new this.discountModel(dataCreate);
      if (!creatediscount) throw new UnauthorizedException('Create Fail');

      const datanotification = {
        name: discountDto.name,
        discount: creatediscount._id,
        type: ENotificationType.ALLUSER,
      };
      const createnotification = new this.notificationModel(datanotification);
      createnotification.save();
      creatediscount.save();
      return creatediscount;
    } catch (error) {
      console.log('error', error);
      return error.message;
    }
  }

  async getAllForAdmin(page: number): Promise<any> {
    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    const getAll = await this.discountModel
      .find({})
      .populate([{ path: 'cinema', select: 'name address hotline' }])
      .skip(skip)
      .limit(pageSize);

    return getAll;
  }

  async getAllForUser(): Promise<any> {
    const getAll = await this.discountModel
      .find({ status: EUserStatus.ACTIVE })
      .populate([{ path: 'cinema', select: 'name address hotline' }]);

    return getAll;
  }

  async getDiscount(discountId: any): Promise<any> {
    const getDiscount = await this.discountModel
      .findById(discountId)
      .populate([{ path: 'cinema', select: 'name address hotline' }]);
    if (!getDiscount) {
      return 'Get Failed';
    }
    return getDiscount;
  }

  async getDiscountByType(type: any): Promise<any> {
    const getDiscount = await this.discountModel
      .find({ type: type })
      .populate([{ path: 'cinema', select: 'name address hotline' }]);
    if (!getDiscount) {
      return 'Get Failed';
    }
    return getDiscount;
  }

  async checkCodeDiscount(code: any, cinemaId: any): Promise<any> {
    const date = new Date(Date.now());
    const discount = await await this.discountModel.findOne({
      code: code,
      dayEnd: { $gte: date },
      dayStart: { $lte: date },
    });
    if (!discount || discount.status != EDiscountStatus.ACTIVE) {
      return 'Your Code Does Not Exist';
    }
    const isCinemaValid = discount.cinema.some((cinemaObjectId) =>
      cinemaObjectId.equals(cinemaId),
    );
    if (!isCinemaValid) {
      return 'Your Code Not Applicable At This Cinema';
    }

    return discount;
  }

  async UpdateStatusDiscount(discountId: any): Promise<any> {
    const discount = await this.discountModel.findById(discountId);
    if (discount.status === EDiscountStatus.INACTIVE) {
      const update = await this.discountModel.findByIdAndUpdate(discountId, {
        status: EDiscountStatus.ACTIVE,
      });
      return update;
    } else {
      const update = await this.discountModel.findByIdAndUpdate(discountId, {
        status: EDiscountStatus.INACTIVE,
      });
      return update;
    }
  }

  async updateDiscount(discountId: any, dataUpdate: any): Promise<any> {
    if (dataUpdate.dayStart != undefined && dataUpdate.dayEnd != undefined) {
      const data = {
        ...dataUpdate,
        dayStart: new Date(dataUpdate.dayStart),
        dayEnd: new Date(dataUpdate.dayEnd),
      };
      const update = await this.discountModel.findByIdAndUpdate(
        discountId,
        data,
        {
          new: true,
        },
      );
      if (!update) {
        return 'Update Failed';
      }
      return update;
    } else if (dataUpdate.dayStart != undefined) {
      const data = {
        ...dataUpdate,
        dayStart: new Date(dataUpdate.dayStart),
      };
      const update = await this.discountModel.findByIdAndUpdate(
        discountId,
        data,
        {
          new: true,
        },
      );
      if (!update) {
        return 'Update Failed';
      }
      return update;
    } else if (dataUpdate.dayEnd != undefined) {
      const data = {
        ...dataUpdate,
        dayEnd: new Date(dataUpdate.dayEnd),
      };
      const update = await this.discountModel.findByIdAndUpdate(
        discountId,
        data,
        {
          new: true,
        },
      );
      if (!update) {
        return 'Update Failed';
      }
      return update;
    }
    const update = await this.discountModel.findByIdAndUpdate(
      discountId,
      dataUpdate,
      {
        new: true,
      },
    );
    if (!update) {
      return 'Update Failed';
    }
    return update;
  }

  async deleteDiscount(discountId: any, password: any): Promise<any> {
    if (password != '8888') {
      return 'You do not have sufficient authority to delete';
    }
    const deletediscount =
      await this.discountModel.findByIdAndDelete(discountId);
    if (!deletediscount) {
      return 'Delete Failed';
    }
    return deletediscount;
  }
}
