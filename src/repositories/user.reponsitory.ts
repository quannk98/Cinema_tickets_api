import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { get } from 'http';
import { Model } from 'mongoose';
import { IUserOtp } from 'src/common/enums/interfaces/user.interface';
import { EUserRole, EUserStatus } from 'src/common/enums/user.enum';
import { CreateUserDto } from 'src/modules/auth/dto/create-user.dto';
import { StaffDto } from 'src/modules/auth/dto/staff.dto';
import { UserOtp } from 'src/schemas/user-otp.schema';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(UserOtp.name) private readonly userOtpModel: Model<UserOtp>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<any> {
    try {
      const exitsUser = await this.userModel.findOne({
        email: createUserDto.email,
        status: EUserStatus.ACTIVE,
      });
      if (exitsUser) throw new ConflictException('Email already exists');
      const register = await this.userModel.findOne({
        email: createUserDto.email,
        role: EUserRole.User,
        status: EUserStatus.INACTIVE,
      });
      if (register) {
        await this.userModel.findByIdAndDelete(register._id);
        const otp = await this.userOtpModel.findOne({ userId: register._id });
        await this.userOtpModel.findByIdAndDelete(otp._id);
      }

      const createdUSer = new this.userModel(createUserDto);

      await createdUSer.save();

      return createdUSer;
    } catch (error) {
      return {
        data: error.message,
      };
    }
  }
  async getAllUser(page: number): Promise<any> {
    const pageSize = 10;
    const skip = (page - 1) * pageSize;
    const getAlluser = await this.userModel
      .find({ role: EUserRole.User })
      .skip(skip)
      .limit(pageSize);
    return getAlluser;
  }
  async findUserById(userId: any): Promise<any> {
    const user = await this.userModel.findById(userId);
    if (!user) throw new UnauthorizedException('User not available');
    return user;
  }
  async findByEmailLogin(email: string, tokendevice: string): Promise<any> {
    const user = await this.userModel.findOne({
      email: email,
      status: EUserStatus.ACTIVE,
    });

    if (!user) throw new UnauthorizedException('Invalid email or password');
    if (tokendevice) {
      await this.userModel.findByIdAndUpdate(
        user._id,
        { tokendevice: tokendevice },
        { new: true },
      );
    }

    return user;
  }

  async findByEmail(email: string): Promise<any> {
    const user = await this.userModel.findOne({
      email: email,
      status: EUserStatus.ACTIVE,
    });

    if (!user) throw new UnauthorizedException('Invalid email or password');
    return user;
  }

  async updateUserById(userId: any, dataUpdate: any): Promise<any> {
    try {
      const update = await this.userModel.findByIdAndUpdate(
        userId,
        dataUpdate,
        {
          new: true,
        },
      );
      if (!update) {
        return 'Update failed';
      }
      return update;
    } catch (error) {}
  }

  async updateStatusUser(userId: any): Promise<any> {
    const getUser = await this.userModel.findById(userId);
    if (getUser.status === EUserStatus.ACTIVE) {
      const update = await this.userModel.findByIdAndUpdate(
        userId,
        { status: EUserStatus.INACTIVE },
        { new: true },
      );
      return update;
    } else if (getUser.status === EUserStatus.INACTIVE) {
      const update = await this.userModel.findByIdAndUpdate(
        userId,
        { status: EUserStatus.ACTIVE },
        { new: true },
      );
      return update;
    }
  }

  async updatePassword(userId: any, passwordNew: any): Promise<any> {
    try {
      const update = await this.userModel.findByIdAndUpdate(
        userId,
        { password: passwordNew },
        {
          new: true,
        },
      );
      if (!update) {
        return 'Update failed';
      }

      return 'Đổi mật khẩu thành công';
    } catch (error) {}
  }

  async deleteUserById(userId: any, password: any): Promise<any> {
    try {
      if (password != '8888') {
        return 'You do not have sufficient authority to delete';
      }
      const deleteuser = await this.userModel.findByIdAndDelete(userId);
      if (!deleteuser) {
        return 'Delete failed';
      }
      return deleteuser;
    } catch (error) {
      return 'Delete failed';
    }
  }

  async createStaff(staffDto: StaffDto): Promise<any> {
    try {
      const exists = await this.userModel.findOne({
        email: staffDto.email,
      });
      if (exists) throw new ConflictException('Staff already exists');

      const createstaff = await new this.userModel(staffDto);
      await createstaff.save();
      if (!createstaff) {
        return 'create staff failed';
      }
      return createstaff;
    } catch (error) {
      return error.response;
    }
  }

  async getAllStaff(page: number): Promise<any> {
    const pageSize = 10;
    const skip = (page - 1) * pageSize;
    const getall = await this.userModel
      .find({ role: EUserRole.Staff })
      .skip(skip)
      .limit(pageSize);
    return getall;
  }

  async getStaff(staffId: any): Promise<any> {
    try {
      const getstaff = await this.userModel.findById(staffId);
      if (!getstaff) {
        return 'Staff not available';
      }
      return getstaff;
    } catch (error) {
      return 'Staff not available';
    }
  }
  async UpdateStatusStaff(staffId: any): Promise<any> {
    const getStaff = await this.userModel.findById(staffId);
    if (getStaff.status === EUserStatus.ACTIVE) {
      const update = await this.userModel.findByIdAndUpdate(
        staffId,
        { status: EUserStatus.INACTIVE },
        { new: true },
      );
      return update;
    } else if (getStaff.status === EUserStatus.INACTIVE) {
      const update = await this.userModel.findByIdAndUpdate(
        staffId,
        { status: EUserStatus.ACTIVE },
        { new: true },
      );
      return update;
    }
  }
}
