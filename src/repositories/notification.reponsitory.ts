import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ENotificationType } from 'src/common/enums/user.enum';
import { NotificationDto } from 'src/modules/notification/dto/notification.dto';
import { Notification } from 'src/schemas/notification.schema';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class NotificationReponsitory {
  constructor(
    @InjectModel(Notification.name)
    private readonly NotificationModel: Model<Notification>,
    @InjectModel(User.name)
    private readonly UserModel: Model<User>,
  ) {}

  async CreateNotificationUsers(
    notificationDto: NotificationDto,
  ): Promise<any> {
    const users = await this.UserModel.find({});

    if (!users.length) {
      throw new Error('No users found');
    }

    const dataNotifications = users.map((user) => {
      return {
        ...notificationDto,
        user: user._id,
        type: ENotificationType.ALLUSER,
        date: new Date(notificationDto.date),
      };
    });

    const create = new this.NotificationModel(dataNotifications);
    if (!create) throw new UnauthorizedException('Create Fail');
    create.save();
    return create;
  }

  async CreateNotificationUser(data: any): Promise<any> {
    try {
      const dataNotifiUser = {
        ...data,
        type: ENotificationType.SINGLEUSER,
      };
      const create = new this.NotificationModel(dataNotifiUser);

      if (!create) throw new UnauthorizedException('Create Fail');

      create.save();
      return create;
    } catch (error) {
      console.log('error', error);
    }
  }

  async getNotifications(): Promise<any> {
    const getnotifications = await this.NotificationModel.find({});
    return getnotifications;
  }

  async getNotification(notificationId: any): Promise<Notification> {
    const getnotification =
      await this.NotificationModel.findById(notificationId);
    return getnotification;
  }

  async getNotificationByUser(userId: any): Promise<any> {
    const getnotification = await this.NotificationModel.find({ user: userId });
    const getNotifiDiscount = await this.NotificationModel.find({
      type: ENotificationType.ALLUSER,
    });
    const notifi = {
      getnotification,
      getNotifiDiscount,
    };
    return notifi;
  }

  async update(notificationId: any, data: any): Promise<any> {
    const updateNotification = await this.NotificationModel.findByIdAndUpdate(
      notificationId,
      data,
      { new: true },
    );
    if (!updateNotification) throw new UnauthorizedException('Update Failed');
    return updateNotification;
  }

  async deleteNotificaton(notificationId: any, password: any): Promise<any> {
    if (password != '8888') {
      return 'You do not have sufficient authority to delete';
    }
    await this.NotificationModel.findByIdAndDelete(notificationId);
  }

  // async checkNotification(): Promise<any> {
  //   const date = new Date(Date.now());
  //   const getnotifications = await this.NotificationModel.find({
  //     dayStart: { $gte: date },
  //     dayEnd: { $lte: date },
  //   });
  //   return getnotifications;
  // }
}
