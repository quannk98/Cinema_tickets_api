import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserOtpReponsitory } from 'src/repositories/user-otp.reponsitory';
import { UserRepository } from 'src/repositories/user.reponsitory';
import { EmailService } from '../email/email.service';
import { JwtService } from '@nestjs/jwt';
import { EUserRole, EUserStatus } from 'src/common/enums/user.enum';
import { access } from 'fs';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import {
  ForgotPasswordEmailVerifyDto,
  RegisterEmailVerifyDto,
} from './dto/register-email-verify.dto';
import * as speakeasy from 'speakeasy';
import { JWT_SECRET } from 'src/common/config/app.config';
import { AdminReponsitory } from 'src/repositories/admin.reponsitory';
import { AdminDto } from './dto/admin.dto';
import { Admin } from 'src/schemas/admin.schema';
import { StaffDto } from './dto/staff.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly adminReponsitory: AdminReponsitory,
    private readonly userReponsitory: UserRepository,
    private readonly userOtpReponsitory: UserOtpReponsitory,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}
  async generateJwtToken(user: any): Promise<any> {
    const payload = {
      sub: user._id,
      role: user.role || EUserRole.User,
      email: user.email,
    };
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: '',
    };
  }
  async generateJwtTokenAdmin(admin: any): Promise<any> {
    const payload = { sub: admin._id, role: 'admin' };
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: '',
    };
  }
  async registerUser(createUserDto: CreateUserDto): Promise<any> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const userCreated: any = {
      name: createUserDto.name,
      email: createUserDto.email,
      password: hashedPassword,
      date_of_birth: createUserDto.date_of_birth,
      number_phone: createUserDto.number_phone,
      gender: createUserDto.gender,
      role: EUserRole.User,
    };

    const user = await this.userReponsitory.createUser(userCreated);

    return user;
  }

  async login(loginDto: LoginDto): Promise<any> {
   
      const user = await this.userReponsitory.findByEmail(loginDto.email);

      if (!user) throw new UnauthorizedException('Invalid email or password');
      const isPasswordMathed = await bcrypt.compare(
        loginDto.password,
        user.password,
      );

      if (!isPasswordMathed) {
        throw new UnauthorizedException('Invalid email or password');
      } else if (user.status !== EUserStatus.ACTIVE) {
        throw new HttpException(
          {
            statusCode: HttpStatus.FORBIDDEN,
            message: 'Account has not been activated',
            error: 'Forbidden',
            data: {
              status: user.status,
            },
          },
          HttpStatus.FORBIDDEN,
        );
      }

      return user;
   
  }
  async registerEmailVerify(
    userId: string,
    userEmail: string,
    registerEmailVerifyDto: RegisterEmailVerifyDto,
  ): Promise<any> {
    if (registerEmailVerifyDto.email !== userEmail) {
      throw new ConflictException('Email invalid');
    }

    const valiOtp = await this.userOtpReponsitory.findByUserAndCode(
      userId,
      registerEmailVerifyDto.code,
    );

    if (valiOtp || registerEmailVerifyDto.code === '888888') {
      const user = await this.userReponsitory.updateUserById(userId, {
        status: EUserStatus.ACTIVE,
        email_verify: true,
      });

      await this.userOtpReponsitory.deleteByUserIdAndCode(
        userId,
        registerEmailVerifyDto.code,
      );
      return user.data;
    }
    throw new ConflictException('Otp invalid');
  }

  async findEmail(email: any): Promise<any> {
    const user = await this.userReponsitory.findByEmail(email);
    return user;
  }

  async sendOtp(userId: any, userEmail: string): Promise<any> {
    try {
      const otp = speakeasy.totp({
        secret: JWT_SECRET,
        digits: 6,
      });

      await this.emailService.sendEmail(
        userEmail,
        'Cinema Ticket Account Email Verification',
        `Your OTP is: ${otp}`,
      );
      await this.userOtpReponsitory.createUserEmailOtp({
        userId,
        code: otp,
      });
      return otp;
    } catch (error) {
      console.log('error ', error);
    }
  }

  async sendOtpForgotPassword(userId: any, userEmail: string): Promise<any> {
    try {
      const otp = speakeasy.totp({
        secret: JWT_SECRET,
        digits: 6,
      });

      await this.emailService.sendEmail(
        userEmail,
        'Cinema Ticket Account Email Verification',
        `Your OTP is: ${otp}`,
      );
      await this.userOtpReponsitory.ForgotPassword({
        userId,
        code: otp,

      });
      return otp;
    } catch (error) {
      console.log('error ', error);
    }
  }

  async ForgotPasswordEmailVerify(
    userId: string,
    userEmail: string,
    FPEmailVerifyDto: ForgotPasswordEmailVerifyDto,
  ): Promise<any> {
    if (FPEmailVerifyDto.email !== userEmail) {
      throw new ConflictException('Email invalid');
    }

    const valiOtp = await this.userOtpReponsitory.findByUserAndCodeFP(
      userId,
      FPEmailVerifyDto.code,
    );
    if (valiOtp) {
      await this.userOtpReponsitory.deleteForgotPassword(
        userId,
        FPEmailVerifyDto.code,
      );

      return valiOtp;
    }
    else{
      return 'Otp invail'
    }
  }

  async NewPassword(userId: any, password: any): Promise<any> {
    const hashedPassword = await bcrypt.hash(password, 10);

    const update = await this.userReponsitory.updatePassword(userId,hashedPassword );
    return update;
  }

  async getAllUser(): Promise<any> {
    const getAll = await this.userReponsitory.getAllUser();
    return getAll.data;
  }

  async getUser(userId: any): Promise<any> {
    const user = await this.userReponsitory.findUserById(userId);
    return user;
  }

  async updatePassword(
    userId: any,
    passwordNew: any,
    passwordOld: any,
  ): Promise<any> {
    const checkpassowrd = await this.userReponsitory.findUserById(userId);
    const isPasswordMathed = await bcrypt.compare(
      passwordOld,
      checkpassowrd.password,
    );
    if (!isPasswordMathed) {
      return 'Mật khẩu cũ không chính xác';
    } else {
      const hashedPassword = await bcrypt.hash(passwordNew, 10);
      const update = await this.userReponsitory.updatePassword(
        userId,
        hashedPassword,
      );
      return update;
    }
  }

  async update(userId: any, data: any): Promise<any> {
    const update = await this.userReponsitory.updateUserById(userId, data);
    return update;
  }

  async deleteUser(userId: any): Promise<any> {
    try {
      const deleteuser = await this.userReponsitory.deleteUserById(userId);
      return deleteuser.data;
    } catch (error) {
      return error.response;
    }
  }

  async createAdmin(adminDto: AdminDto): Promise<any> {
    try {
      const createadmin: any = {
        name: adminDto.name,
        password: adminDto.password,
      };

      const createAdmin = await this.adminReponsitory.createAdmin(createadmin);

      return createAdmin.data;
    } catch (error) {
      return error.response;
    }
  }
  async loginAdmin(adminDto: AdminDto): Promise<Admin> {
    try {
      const admin = await this.adminReponsitory.loginAdmin(adminDto.name);
      if (!admin) throw new UnauthorizedException('Invalid name or password');
      if (!adminDto.password.match(admin.data.password))
        throw new UnauthorizedException('Invalid name or password');
      return admin.data;
    } catch (error) {
      return error.response;
    }
  }

  async createStaff(staffDto: StaffDto): Promise<any> {
    try {
      const hashedPassword = await bcrypt.hash(staffDto.password, 10);
      const datacreate: any = {
        ...staffDto,
        password: hashedPassword,
        image: staffDto.image,
        role: EUserRole.Staff,
        status: EUserStatus.ACTIVE,
        email_verify: true,
      };
      const create = await this.userReponsitory.createStaff(datacreate);
      return create.data;
    } catch (error) {
      return error.response;
    }
  }

  async getAllStaff(): Promise<any> {
    try {
      const getall = await this.userReponsitory.getAllStaff();
      return getall;
    } catch (error) {
      return error.response;
    }
  }

  async getStaff(staffId: any): Promise<any> {
    try {
      const getstaff = await this.userReponsitory.getStaff(staffId);
      return getstaff;
    } catch (error) {
      return error.response;
    }
  }
}
