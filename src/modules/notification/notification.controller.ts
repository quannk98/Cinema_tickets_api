import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationDto } from './dto/notification.dto';
import { AuthGuard } from '../auth/auth.guard';
import { AuthAdminGuard } from '../auth/dto/admin.guard';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  // @UseGuards(AuthAdminGuard)
  // @Post('users')
  // async create(notificationDto: NotificationDto): Promise<any> {
  //   const createNotification =
  //     await this.notificationService.CreateNotificationUsers(notificationDto);
  //   return createNotification;
  // }

  @UseGuards(AuthGuard)
  @Get('id')
  async getNotification(@Param('id') id: any): Promise<any> {
    const get = await this.notificationService.getNotification(id);
    return get;
  }

  @UseGuards(AuthGuard)
  @Get('notifi/user/:userId')
  async getNotificationByUser(@Param('userId') userId: any): Promise<any> {
    const get = await this.notificationService.getNotificationByUser(userId);
    return get;
  }

  @UseGuards(AuthGuard)
  @Get('')
  async getNotifications(): Promise<any> {
    const get = await this.notificationService.getNotifications();
    return get;
  }

  @Put(':id')
  async updateNotification(
    @Param('id') id: any,
    @Body() notificationDto: NotificationDto,
  ): Promise<any> {
    const update = await this.notificationService.update(id, notificationDto);
    return update;
  }

  @UseGuards(AuthAdminGuard)
  @Delete(':id')
  async deleteNotification(
    @Param('id') id: any,
    @Query('password') password: any,
  ): Promise<any> {
    const deletenotification =
      await this.notificationService.deleteNotification(id, password);
    return deletenotification;
  }
}
