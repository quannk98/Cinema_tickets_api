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
    return ticket.data;
  }

  async getAll(): Promise<any> {
    const getall = await this.ticketReponsitory.getAll();
    return getall;
  }
  async getticket(ticketId: any): Promise<any> {
    try {
      const getTicket = await this.ticketReponsitory.getTicket(ticketId);
      return getTicket;
    } catch (error) {
      console.log('error', error);
    }
  }

  async getTicketByUser(userId: any): Promise<any> {
    const getTicket = await this.ticketReponsitory.getTicketByUser(userId);
    return getTicket;
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

  async updateStatusTicket(
    ticketId: any,
    status: any,
  ): Promise<any> {
    const update = await this.ticketReponsitory.updateStatusTicket(
      ticketId,
      status,
    );
    return update;
  }

  async updateStatus(seatId: any, status: ESeatStatus): Promise<any> {
    return await this.ticketReponsitory.updateStatus(seatId, status);
  }

  async deleteTicket(ticketId: any): Promise<any> {
    const deleteTicket = await this.ticketReponsitory.deleteTicket(ticketId);
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
}
