import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FcmNotificationService } from './firebase.service';

@Controller('firebase')
export class FcmNotificationController {
  constructor(
    private readonly sendingNotificationService: FcmNotificationService,
  ) {}

  // @Post('send-notification/')
  // async sendNotidication(@Body() body: { token: string }) {
  //   const { token } = body;
  //   return await this.sendingNotificationService.sendingNotificationOneUser(
  //     token,
  //   );
  // }
}
