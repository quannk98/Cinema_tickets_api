import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { populate } from 'dotenv';
import { Model } from 'mongoose';
import path from 'path';
import { ESeatStatus, ETicketStatus } from 'src/common/enums/user.enum';
import { TicketDto } from 'src/modules/ticket/dto/ticket.dto';
import { Cinema } from 'src/schemas/cinema.schema';
import { Movie } from 'src/schemas/movie.schema';
import { Room } from 'src/schemas/room.schema';
import { Seat } from 'src/schemas/seat.schema';
import { Showtime } from 'src/schemas/showtime.schema';
import { Ticket } from 'src/schemas/ticket.schema';
import { Time } from 'src/schemas/time.schema';
import mongoose from 'mongoose';
import { Seatstatus } from 'src/schemas/seatstatus.schema';

@Injectable()
export class TicketReponsitory {
  constructor(
    @InjectModel(Ticket.name) private readonly ticketModel: Model<Ticket>,
    @InjectModel(Seat.name) private readonly seatModel: Model<Seat>,
    @InjectModel(Cinema.name) private readonly cinemaModel: Model<Cinema>,
    @InjectModel(Room.name) private readonly roomModel: Model<Room>,
    @InjectModel(Movie.name) private readonly movieModel: Model<Movie>,
    @InjectModel(Showtime.name) private readonly showtimeModel: Model<Showtime>,
    @InjectModel(Time.name) private readonly timeModel: Model<Time>,
    @InjectModel(Seatstatus.name)
    private readonly seatstatusModel: Model<Seatstatus>,
  ) {}
  async create(ticketDto: TicketDto): Promise<any> {
    try {
      const seats = await this.seatModel.find({ _id: { $in: ticketDto.seat } });
      const idroom = seats[0].room;
      const room = await this.roomModel.findById(idroom);
      const movie = await this.movieModel.findById(room.movie);
      const showtime = await this.showtimeModel.findById(ticketDto.showdate);
      const cinema = await this.cinemaModel.findById(room.cinema);
      const time = await this.timeModel.findById(ticketDto.showtime);
      const dataCreate = {
        ...ticketDto,
        room: room._id,
        movie: movie._id,
        showdate: showtime._id,
        time: time._id,
        cinema: cinema._id,
      };
      

      const seatStatusPromises = [];

      for (const seatId of ticketDto.seat) {
        const seatStatusCreate = {
          seat: seatId,
          room: room._id,
          cinema: cinema._id,
          day: showtime._id,
          date: new Date(showtime.date),
          time: time._id,
          status: ESeatStatus.WAITING,
        };
        const exists = await this.seatstatusModel.findOne({
          seat: seatId,
          room: room._id,
          cinema: cinema._id,
          day: showtime._id,
          date: new Date(showtime.date),
          time: time._id,
        });
      
        if (!exists) {
          seatStatusPromises.push(
            await new this.seatstatusModel(seatStatusCreate).save(),
          );
        } else {
          await this.seatstatusModel.findByIdAndUpdate(
            exists._id,
            {
              status: ESeatStatus.WAITING,
            },
            { new: true },
          );
        }
      }

      const newTicket = new this.ticketModel(dataCreate);
      const createdTicket = await newTicket.save();

      return {
        data: createdTicket,
        message: 'Ticket created successfully',
      };
    } catch (error) {
      console.error('Error creating ticket:', error);
      return {
        status: 'error',
        message: 'Failed to create ticket',
      };
    }
  }

  async getAll(): Promise<any> {
    const getAll: any = await this.ticketModel.find({}).populate([
      {
        path: 'discount',
        select: 'name image percent code type cinema',
      },
      {
        path: 'movie',
        select: 'name duration image genre',
        populate:([
          {path:'genre',select:'name image'}
        ])
      },
      {
        path: 'room',
        select: 'name',
      },
      {
        path: 'seat',
        select: 'name price status',
      },
      {
        path: 'showdate',
        select: 'date',
      },
      {
        path: 'time',
        select: 'time',
      },
      { path: 'user', select: 'name email image' },
      { path: 'food', select: 'name price image' },
      { path: 'cinema', select: 'name address' },
    ]);
    return getAll;
  }
  async getTicket(ticketId: any): Promise<any> {
    try {
      const getTicket: any = await this.ticketModel
        .findById(ticketId)
        .populate([
          {
            path: 'discount',
            select: 'name percent code type cinema',
          },
          {
            path: 'movie',
            select: 'name duration image genre',
            populate:([
              {path:'genre',select:'name image'}
            ])
          },
          {
            path: 'room',
            select: 'name',
          },
          {
            path: 'seat',
            select: 'name price status',
          },
          {
            path: 'showdate',
            select: 'date',
          },
          {
            path: 'time',
            select: 'time',
          },
          { path: 'user', select: 'name email image' },
          { path: 'food', select: 'name price image' },
          { path: 'cinema', select: 'name address' },
        ]);

      if (!getTicket) {
        return {
          status: 'error',
          message: 'Get Failed',
        };
      }

      return getTicket;
    } catch (error) {
      console.log('error', error);
    }
  }

  async getTicketByUser(userId: any): Promise<any> {
    const getTicket: any = await this.ticketModel
      .find({ user: userId })
      .populate([
        {
          path: 'discount',
          select: 'name percent code type cinema',
        },
        {
          path: 'movie',
          select: 'name duration image genre',
          populate:([
            {path:'genre',select:'name image'}
          ])
        },
        {
          path: 'room',
          select: 'name',
        },
        {
          path: 'seat',
          select: 'name price status',
        },
        {
          path: 'showdate',
          select: 'date',
        },
        {
          path: 'time',
          select: 'time',
        },
        { path: 'user', select: 'name email image' },
        { path: 'food', select: 'name price image' },
        { path: 'cinema', select: 'name address' },
      ]);
    if (!getTicket) {
      return {
        status: 'error',
        message: 'Get Failed',
      };
    }
    return getTicket;
  }


  async getRevenue(): Promise<any> {
    const allTickets = await this.ticketModel.find({
      status: { $ne: ETicketStatus.INACTIVE },
    });
    let totalRevenue = 0;
    for (const ticket of allTickets) {
      totalRevenue += ticket.total;
    }

    const getRevenue = {
      total: totalRevenue,
    };

    return getRevenue;
  }

  async getRevenueByUser(userId: any): Promise<any> {
    const allTicketsByUser: any = await this.ticketModel
      .find({
        status: !ETicketStatus.INACTIVE,
        user: userId,
      })
      .populate([{ path: 'user', select: 'name' }]);
    let totalRevenue = 0;
    for (const ticket of allTicketsByUser) {
      totalRevenue += ticket.total;
    }

    const nameuser = allTicketsByUser[0].user.name;
    const getRevenueUser = {
      User: nameuser,
      total: totalRevenue,
    };

    return getRevenueUser;
  }

  async getRevenueByCMD(
    cinemaId: any,
    movieId: any,
    dayStart: string,
    dayEnd: string,
  ): Promise<any> {
    let filter: any = { status: { $ne: ETicketStatus.INACTIVE } };

    if (cinemaId) {
      filter.cinema = new mongoose.Types.ObjectId(cinemaId);
    }
    if (movieId) {
      filter.movie = new mongoose.Types.ObjectId(movieId);
    }
    if (dayStart && dayEnd) {
      filter.date = {
        $gte: new Date(dayStart),
        $lte: new Date(dayEnd),
      };
    }


    const reportData = await this.ticketModel.aggregate([
      { $match: filter },
      {
        $lookup: {
          from: 'movies',
          localField: 'movie',
          foreignField: '_id',
          as: 'movieData',
        },
      },
      {
        $lookup: {
          from: 'cinemas',
          localField: 'cinema',
          foreignField: '_id',
          as: 'cinemaData',
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$total' },
        },
      },
      {
        $project: {
          totalRevenue: 1,
        },
      },
    ]);

    return reportData;
  }

  async checkTicket(): Promise<any> {
    const time = Date.now() - 1 * 60 * 1000;
    const date = new Date(time)
    const inactiveTickets = await this.ticketModel.find({
      status: ETicketStatus.INACTIVE,
      date: { $lt: date },
    });
    if (inactiveTickets.length > 0) {
      for (const ticket of inactiveTickets) {
        await Promise.all(
          ticket.seat.map(async (seatId) => {
            await this.seatstatusModel.findOneAndUpdate(
              { seat: seatId },
              { status: ESeatStatus.AVAILABLE },
              { new: true },
            );
          }),
        );

        await this.ticketModel.findByIdAndDelete(ticket._id);
      }
    }
  }

  async updateStatus(seatId: any, status: ESeatStatus): Promise<any> {
    const update = await this.seatstatusModel.findOneAndUpdate(
      { seat: seatId },
      { status: status },
      {
        new: true,
      },
    );

    if (!update) {
      return {
        status: 'error',
        message: 'Update Failed',
      };
    }
    return update;
  }

  async updateStatusTicket(ticketId: any, status: any): Promise<any> {
    const update = await this.ticketModel.findByIdAndUpdate(
      ticketId,
      { status: status },
      {
        new: true,
      },
    );
    if (!update) throw new UnauthorizedException("Vé của bạn không tồn tại")
    return update;
  }

  async updateTicket(ticketId: any, dataUpdate: any): Promise<any> {
    const update = await this.ticketModel.findByIdAndUpdate(
      ticketId,
      dataUpdate,
      {
        new: true,
      },
    );
    if (!update) {
      return {
        status: 'error',
        message: 'Update Failed',
      };
    }
    return update;
  }

  async deleteTicket(ticketId: any): Promise<any> {
    const deleteticket = await this.ticketModel.findByIdAndDelete(ticketId);
    if (!deleteticket) {
      return {
        status: 'error',
        message: 'Delete Failed',
      };
    }
    return deleteticket;
  }
}
