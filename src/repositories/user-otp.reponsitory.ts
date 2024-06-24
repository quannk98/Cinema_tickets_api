import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EOtpType } from 'src/common/enums/auth.enum';
import { IUserOtp } from 'src/common/enums/interfaces/user.interface';
import { UserOtp } from 'src/schemas/user-otp.schema';

@Injectable()
export class UserOtpReponsitory {
  constructor(
    @InjectModel(UserOtp.name) private readonly userOtpModel: Model<UserOtp>,
  ) {}
  async createUserEmailOtp(otpCreateData: IUserOtp): Promise<any> {
    const createUserDto = new this.userOtpModel(otpCreateData);
    if (!createUserDto) {
      return {
        status: 'error',
        message: 'Create User OTP Failed',
      };
    }
    return createUserDto.save();
  }

  async findByUserAndCode(userId: any, code: string): Promise<any> {
    const userOtp = await this.userOtpModel.findOne({
      userId,
      code,
      type: EOtpType.register,
    });
    if (!userOtp) {
      return {
        status: 'error',
        message: 'Find Code Failed',
      };
    }
    return userOtp;
  }

  async ForgotPassword(otpCreateData: IUserOtp): Promise<any> {
    const data = {
      ...otpCreateData,
      type:EOtpType.fotgotpassword
    }
    const createFP = new this.userOtpModel(data);
    if (!createFP) {
      return {
        status: 'error',
        message: 'Create User OTP Failed',
      };
    }
    return createFP.save();
  }

  async findByUserAndCodeFP(userId: any, code: string): Promise<any> {
    const userOtpFP = await this.userOtpModel.findOne({
      userId,
      code,
      type: EOtpType.fotgotpassword,
    });
    if (!userOtpFP) {
      return {
        status: 'error',
        message: 'Find Code Failed',
      };
    }
    return userOtpFP;
  }

  async deleteByUserIdAndCode(userId: any, code: string): Promise<any> {
    const deleteCode = await this.userOtpModel.findOneAndDelete({
      userId,
      code,
      type: EOtpType.register,
    });
    if (!deleteCode) {
      return {
        status: 'error',
        message: 'Delete Failed',
      };
    }
    return deleteCode;
  }

  async deleteForgotPassword(userId: any, code: string): Promise<any> {
    const deleteCode = await this.userOtpModel.findOneAndDelete({
      userId,
      code,
      type: EOtpType.fotgotpassword,
    });
    if (!deleteCode) {
      return {
        status: 'error',
        message: 'Delete Failed',
      };
    }
    return deleteCode;
  }
}
