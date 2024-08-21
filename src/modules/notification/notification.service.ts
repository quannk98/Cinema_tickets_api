import { Inject, Injectable } from '@nestjs/common';
import { NotificationReponsitory } from 'src/repositories/notification.reponsitory';
import { NotificationDto } from './dto/notification.dto';
import { ENotificationStatus } from 'src/common/enums/user.enum';
import { Cron } from '@nestjs/schedule';
import * as admin from 'firebase-admin';
// import { SocketService } from '../ticket/socket.service';

@Injectable()
export class NotificationService {
  constructor(
    private readonly notificationReponsitory: NotificationReponsitory,
  ) {}

  async CreateNotificationUser(data: any): Promise<any> {
    const create =
      await this.notificationReponsitory.CreateNotificationUser(data);
    return create;
  }

  async getNotifications(): Promise<any> {
    const get = await this.notificationReponsitory.getNotifications();
    return get;
  }

  async getNotification(notificationId: any): Promise<any> {
    const get =
      await this.notificationReponsitory.getNotification(notificationId);
    return get;
  }

  async getNotificationByUser(userId: any): Promise<any> {
    const get =
      await this.notificationReponsitory.getNotificationByUser(userId);
    return get;
  }

  async update(notificationId: any, data: any): Promise<any> {
    const updateNotification = await this.notificationReponsitory.update(
      notificationId,
      data,
    );
    return updateNotification;
  }

  async deleteNotification(notificationId: any, password: any): Promise<any> {
    await this.notificationReponsitory.deleteNotificaton(
      notificationId,
      password,
    );
  }

  // @Cron('45 * * * * *')
  // async checkNotification(): Promise<any> {
  //   const notifications =
  //     await this.notificationReponsitory.checkNotification();
  //   if (notifications.length) {
  //     const userIds = notifications.map((notification) => notification.user);
  //     // this.socketService.notifications(userIds, notifications.name);
  //   }

  //   return notifications;
  // }
}
