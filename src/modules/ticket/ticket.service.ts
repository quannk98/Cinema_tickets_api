import { Injectable } from '@nestjs/common';
import { TicketReponsitory } from 'src/repositories/ticket.reponsitory';
import { TicketDto } from './dto/ticket.dto';
import { ESeatStatus, ETicketStatus } from 'src/common/enums/user.enum';
import Stripe from 'stripe';
import { PaymentDto } from './dto/payment.dto';
import { get } from 'http';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class TicketService {
  constructor(private readonly ticketReponsitory: TicketReponsitory) {}
  async createTicket(ticketDto: TicketDto): Promise<any> {
    const ticket = await this.ticketReponsitory.create(ticketDto);
    return ticket;
  }

  async getAllTicketForAdmin(page: number): Promise<any> {
    const getall = await this.ticketReponsitory.getAllTicketForAdmin(page);
    return getall;
  }

  // async getAllTicketForUser(): Promise<any> {
  //   const getall = await this.ticketReponsitory.getAllTicketForUser();
  //   return getall;
  // }
  async getticket(ticketId: any): Promise<any> {
    const getTicket = await this.ticketReponsitory.getTicket(ticketId);
    return getTicket;
  }

  async getUser(userId: any): Promise<any> {
    const tokendevice = await this.ticketReponsitory.getUser(userId);
    return tokendevice;
  }
  async getTicketByUserForAdmin(userId: any, page: number): Promise<any> {
    const getTicket = await this.ticketReponsitory.getTicketByUserForAdmin(
      userId,
      page,
    );
    return getTicket;
  }

  async getTicketByUserForUser(userId: any): Promise<any> {
    const getTicket =
      await this.ticketReponsitory.getTicketByUserForUser(userId);
    return getTicket;
  }

  async getTicketByStaffUser(staffId: any): Promise<any> {
    const tickets = await this.ticketReponsitory.getTicketByStaffUser(staffId);
    return tickets;
  }

  async getTicketByStaffAdmin(staffId: any, page: number): Promise<any> {
    const tickets = await this.ticketReponsitory.getTicketByStaffAdmin(
      staffId,
      page,
    );
    return tickets;
  }

  @Cron('45 * * * * *')
  async checkTicket(): Promise<any> {
    await this.ticketReponsitory.checkTicket();
  }

  async updateTicket(ticketId: any, dataUpdate): Promise<any> {
    const update = await this.ticketReponsitory.updateTicket(
      ticketId,
      dataUpdate,
    );
    return update;
  }

  async updateStatusTicketPayment(ticketId: any, status: any): Promise<any> {
    const update = await this.ticketReponsitory.updateStatusTicketPayment(
      ticketId,
      status,
    );
    return update;
  }

  async updateStatusTicketCheckTicket(
    ticketId: any,
    staffId: any,
    time_check: Date,
  ): Promise<any> {
    const update = await this.ticketReponsitory.updateStatusTicketCheckTicket(
      ticketId,
      staffId,
      time_check,
    );
    return update;
  }

  async updateStatusSeat(seatId: any, status: ESeatStatus): Promise<any> {
    return await this.ticketReponsitory.updateStatusSeat(seatId, status);
  }
  async updateFoodTicket(ticketId: any, ticketDto: TicketDto): Promise<any> {
    const update = await this.ticketReponsitory.updateFoodTicket(
      ticketId,
      ticketDto,
    );
    return update;
  }

  async deleteTicket(ticketId: any, password: any): Promise<any> {
    const deleteTicket = await this.ticketReponsitory.deleteTicket(
      ticketId,
      password,
    );
    return deleteTicket;
  }

  async getRevenue(): Promise<any> {
    const revenue = await this.ticketReponsitory.getRevenue();
    return revenue;
  }

  async getRevenueUser(userId: any): Promise<any> {
    const revenue = await this.ticketReponsitory.getRevenueByUser(userId);
    return revenue;
  }

  async getRevenueByCMD(
    cinemaId: any,
    movieId: any,
    dayStart: string,
    dayEnd: string,
  ): Promise<any> {
    const revenue = await this.ticketReponsitory.getRevenueByCMD(
      cinemaId,
      movieId,
      dayStart,
      dayEnd,
    );

    return revenue;
  }

  async getMovieRevenue(page: number): Promise<any> {
    const get = await this.ticketReponsitory.getMovieRevenue(page);
    return get;
  }

  async getCinemaRevenue(): Promise<any> {
    const get = await this.ticketReponsitory.getCinemaRevenue();
    return get;
  }
}
