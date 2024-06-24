import {
  Body,
  Controller,
  Delete,
  Get,
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

@Controller('tickets')
export class TicketController {
  constructor(
    private readonly ticketService: TicketService,
    private readonly stripeService: StripeService,
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

      return {
        create,
      };
    } catch (error) {
      return error.reponse;
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
  @Get('')
  async getAll(): Promise<any> {
    const getall = await this.ticketService.getAll();
    return {
      getall,
    };
  }
  @Get('revenue/:userid')
  async getRevenueuser(@Param('userid') id: any): Promise<any> {
    const revenue = await this.ticketService.getRevenueUser(id);
    return revenue;
  }

  @UseGuards(AuthGuard)
  @Get('user/:userId')
  async getTicketByUser(@Param('userId') id: any): Promise<any> {
    const getTicket = await this.ticketService.getTicketByUser(id);
    return {
      getTicket,
    };
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
  @Put('status/:id')
  async updateStatusticket(
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

      const update = await this.ticketService.updateStatusTicket(
        id,
        ETicketStatus.ACTIVE,
      );
      const tickets = await this.ticketService.getticket(id);

      for (var i = 0; i < tickets.seat.length; i++) {
        await this.ticketService.updateStatus(
          tickets.seat[i],
          ESeatStatus.RESERVED,
        );
      }
      return {
        update,
      };
    }
  }

  @UseGuards(AuthGuard)
  @Put('status/:id/complete')
  async updateStatusticketComplete(@Param('id') id: any): Promise<any> {
    const checkstatus = await this.getTicket(id);
    if (checkstatus.getTicket.status === 'inactive') {
      return 'You have not pay yet';
    } else {
      const update = await this.ticketService.updateStatusTicket(
        id,
        ETicketStatus.COMPLETE,
      );

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
  async deleteTicket(@Param('id') id: any): Promise<any> {
    const tickets = await this.ticketService.getticket(id);
    for (var i = 0; i < tickets.seat.length; i++) {
      await this.ticketService.updateStatus(
        tickets.seat[i],
        ESeatStatus.AVAILABLE,
      );
    }
    const deleteticket = await this.ticketService.deleteTicket(id);
    await this.ticketService.deleteTicket(id);
    return {
      deleteticket,
    };
  }
}
