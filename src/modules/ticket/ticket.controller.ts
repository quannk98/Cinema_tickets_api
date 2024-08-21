import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketDto } from './dto/ticket.dto';
import { SeatService } from '../seat/seat.srevice';
import { ESeatStatus, ETicketStatus } from 'src/common/enums/user.enum';
import { PaymentDto } from './dto/payment.dto';
import Stripe from 'stripe';
import { StripeService } from './Stripe.Service';
import { AuthAdminGuard } from '../auth/dto/admin.guard';
import { AuthGuard } from '../auth/auth.guard';
import { NotificationService } from '../notification/notification.service';
import { Socket } from 'socket.io';
import { NotificationGateway } from '../notification/notification.gateway';
import { FcmNotificationService } from '../firebase_notification/firebase.service';
import { UserRepository } from 'src/repositories/user.reponsitory';

@Controller('tickets')
export class TicketController {
  constructor(
    private readonly ticketService: TicketService,
    private readonly stripeService: StripeService,
    private readonly notificationService: NotificationService,
    private readonly notificationGateway: NotificationGateway,
    private readonly fmcNoticationService: FcmNotificationService,
    private readonly userReponsitory: UserRepository,
  ) {}

  @UseGuards(AuthGuard)
  @Post('')
  async create(@Request() req, @Body() ticketDto: TicketDto): Promise<any> {
    try {
      const dataCreate = {
        ...ticketDto,
        user: req.user.sub,
      };

      const create = await this.ticketService.createTicket(dataCreate);
      const datass = [];

      for (const seat of ticketDto.seat) {
        datass.push({
          seat: seat,
          showday: ticketDto.showdate,
          showtime: ticketDto.showtime,
          status: ESeatStatus.WAITING,
        });

        await this.notificationGateway.StatusSeat(datass[datass.length - 1]);
      }

      return {
        create,
      };
    } catch (error) {
      return error.reponse;
    }
  }

  @UseGuards(AuthAdminGuard)
  @Get('revenue/movie')
  async getMovieRevenue(@Query('page') page: number): Promise<any> {
    try {
      const revenue = await this.ticketService.getMovieRevenue(page);
      return revenue;
    } catch (error) {
      console.log('error', error.reponse);
    }
  }

  @UseGuards(AuthAdminGuard)
  @Get('revenue/cinema')
  async getCinemaRevenue(): Promise<any> {
    try {
      const revenue = await this.ticketService.getCinemaRevenue();
      return revenue;
    } catch (error) {
      console.log('error', error.reponse);
    }
  }

  @UseGuards(AuthAdminGuard)
  @Get('revenue/cmd')
  async getRevenueByCMD(
    @Query('cinemaId') cinemaId,
    @Query('movieId') movieId,
    @Query('dayStart') dayStart,
    @Query('dayEnd') dayEnd,
  ): Promise<any> {
    try {
      const revenue = await this.ticketService.getRevenueByCMD(
        cinemaId,
        movieId,
        dayStart,
        dayEnd,
      );
      return revenue;
    } catch (error) {
      console.log('error', error.reponse);
    }
  }

  @UseGuards(AuthAdminGuard)
  @Get('revenue')
  async getRevenue(): Promise<any> {
    const revenue = await this.ticketService.getRevenue();
    return revenue;
  }

  @UseGuards(AuthAdminGuard)
  @Get('admin')
  async getAllTicketForAdmin(@Query('page') page: number): Promise<any> {
    const getall = await this.ticketService.getAllTicketForAdmin(page);
    return {
      getall,
    };
  }

  // @UseGuards(AuthGuard)
  // @Get('user')
  // async getAllTicketForUser(): Promise<any> {
  //   const getall = await this.ticketService.getAllTicketForUser();
  //   return {
  //     getall,
  //   };
  // }

  @Get('revenue/user/:userid')
  async getRevenueuser(@Param('userid') id: any): Promise<any> {
    const revenue = await this.ticketService.getRevenueUser(id);
    return revenue;
  }

  @UseGuards(AuthAdminGuard)
  @Get('user/admin/:userId')
  async getTicketByUserForAdmin(
    @Param('userId') id: any,
    @Query('page') page: number,
  ): Promise<any> {
    const getTicket = await this.ticketService.getTicketByUserForAdmin(
      id,
      page,
    );
    return {
      getTicket,
    };
  }

  @UseGuards(AuthGuard)
  @Get('user/user/:userId')
  async getTicketByUserForUser(@Param('userId') id: any): Promise<any> {
    const getTicket = await this.ticketService.getTicketByUserForUser(id);
    return {
      getTicket,
    };
  }

  @UseGuards(AuthGuard)
  @Get('staff/:staffId')
  async getTicketByStaffUser(@Param('staffId') staffId: any): Promise<any> {
    const tickets = await this.ticketService.getTicketByStaffUser(staffId);
    return tickets;
  }

  @UseGuards(AuthAdminGuard)
  @Get('staff/admin/:staffId')
  async getTicketByStaffAdmin(
    @Param('staffId') staffId: any,
    @Query('page') page: number,
  ): Promise<any> {
    const tickets = await this.ticketService.getTicketByStaffAdmin(
      staffId,
      page,
    );
    return tickets;
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getTicket(@Param('id') id: any): Promise<any> {
    try {
      const getTicket = await this.ticketService.getticket(id);
      return {
        getTicket,
      };
    } catch (error) {
      console.log('error', error);
    }
  }

  @UseGuards(AuthGuard)
  @Put('food/:id')
  async updateFoodTicket(
    @Param('id') id: any,
    @Body() ticketDto: TicketDto,
  ): Promise<any> {
    const update = await this.ticketService.updateFoodTicket(id, ticketDto);

    return update;
  }

  @UseGuards(AuthGuard)
  @Post('payment/:id')
  async paymentTicket(
    @Param('id') id: any,
    @Body() paymentDto: PaymentDto,
  ): Promise<any> {
    const getticket = await this.ticketService.getticket(id);
    if (getticket.length < 0) {
      return 'Vé của bạn không tồn tại';
    } else {
      const payment = await this.stripeService.createPaymentIntent(paymentDto);
      if (!payment) {
        return 'Payment failed';
      }

      return payment;
    }
  }

  @UseGuards(AuthGuard)
  @Put('status/:id')
  async updateStatusTicketPayment(
    @Request() req,
    @Param('id') id: any,
  ): Promise<any> {
    const getticket = await this.ticketService.getticket(id);
    const update = await this.ticketService.updateStatusTicketPayment(
      id,
      ETicketStatus.ACTIVE,
    );

    for (var i = 0; i < getticket.seat.length; i++) {
      await this.ticketService.updateStatusSeat(
        getticket.seat[i],
        ESeatStatus.RESERVED,
      );
    }
    const dataNotification = {
      name: 'Đặt vé thành công',
      date: getticket.date,
      user: req.user.sub,
      ticket: getticket._id,
    };
    const user = await this.userReponsitory.findUserById(req.user.sub);
    // await this.notificationService.CreateNotificationUser(dataNotification);
    const notifi =
      await this.notificationService.CreateNotificationUser(dataNotification);
    // await this.notificationGateway.NotificationUser(dataNotification);
    await this.fmcNoticationService.sendNotification(
      user.name,
      user.tokendevice,
      notifi._id.toString(),
      getticket._id.toString(),
    );

    const datass = [];
    for (const seat of getticket.seat) {
      datass.push({
        seat: seat._id.toString(),
        showday: getticket.showdate._id.toString(),
        showtime: getticket.time._id.toString(),
        status: ESeatStatus.RESERVED,
      });

      await this.notificationGateway.StatusSeat(datass[datass.length - 1]);
    }

    return {
      update,
    };
  }

  @UseGuards(AuthGuard)
  @Put('status/:id/complete')
  async updateStatusticketComplete(
    @Param('id') id: any,
    @Query('staffId') staffId: any,
    @Query('time_check') time_check: Date,
  ): Promise<any> {
    const checkstatus = await this.getTicket(id);
    if (checkstatus.getTicket.status === ETicketStatus.INACTIVE) {
      return 'Bạn chưa thanh toán vui lòng thanh toán trước khi quét vé';
    } else if (checkstatus.getTicket.status === ETicketStatus.COMPLETE) {
      return 'Vé của bạn đã được quét trước đó! Hãy kiểm tra lại';
    } else {
      const update = await this.ticketService.updateStatusTicketCheckTicket(
        id,
        staffId,
        time_check,
      );
      // const ticket = await this.ticketService.getticket(id);

      return update;
    }
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: any,
    @Body() ticketDto: TicketDto,
  ): Promise<any> {
    try {
      const updated = await this.ticketService.updateTicket(id, ticketDto);
      return {
        updated,
      };
    } catch (error) {
      return error.reponse;
    }
  }

  @UseGuards(AuthAdminGuard)
  @Delete(':id')
  async deleteTicket(
    @Param('id') id: any,
    @Query('password') password: any,
  ): Promise<any> {
    const tickets = await this.ticketService.getticket(id);
    for (var i = 0; i < tickets.seat.length; i++) {
      await this.ticketService.updateStatusSeat(
        tickets.seat[i],
        ESeatStatus.AVAILABLE,
      );
      const data = {
        statusseat: tickets.seat[i],
        status: ESeatStatus.AVAILABLE,
      };
      await this.notificationGateway.StatusSeat(data);
    }
    const deleteticket = await this.ticketService.deleteTicket(id, password);
    await this.ticketService.deleteTicket(id, password);
    return {
      deleteticket,
    };
  }
}
