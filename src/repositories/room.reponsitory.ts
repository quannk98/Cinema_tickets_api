import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { RoomDto } from 'src/modules/room/dto/room.dto';
import { Room } from 'src/schemas/room.schema';
import { Showtime } from 'src/schemas/showtime.schema';
import { Time } from 'src/schemas/time.schema';

@Injectable()
export class RoomReponsitory {
  constructor(
    @InjectModel(Room.name) private readonly roomModel: Model<Room>,
    @InjectModel(Showtime.name) private readonly showtimeModel: Model<Showtime>,
    @InjectModel(Time.name) private readonly timeModel: Model<Time>,
  ) {}
  async createRoom(roomDto: RoomDto): Promise<any> {
    try {
      const Room = await this.roomModel.findOne({
        name: roomDto.name,
        cinema: roomDto.cinema,
      });

      if (Room) {
        const duplicateShowtime = Room.showtime.find((showtime: any) => {
          const showtimeId = showtime._id.toString();
          return roomDto.showtime.includes(showtimeId);
        });
        if (duplicateShowtime) {
          throw new UnauthorizedException('Room already exists');
        }
      }
      const created = new this.roomModel(roomDto);
      if (!created) throw new UnauthorizedException('Create Fail');
      created.save();

      return created;
    } catch (error) {
      return error.message;
    }
  }

  async getAllroom(page: any): Promise<any> {
    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    const getAll = await this.roomModel
      .find({})
      .populate([
        {
          path: 'movie',
          select: 'name duration image',
        },
        {
          path: 'showtime',
          select: 'date time',
          populate: { path: 'time', select: 'time' },
        },
        {
          path: 'cinema',
          select: 'name address hotline',
        },
      ])
      .skip(skip)
      .limit(pageSize);

    return getAll;
  }
  async getroom(roomId: any): Promise<any> {
    const getRoom = await this.roomModel.findById(roomId).populate([
      {
        path: 'movie',
        select: 'name duration image',
      },
      {
        path: 'showtime',
        select: 'date time',
        populate: { path: 'time', select: 'time' },
      },
      {
        path: 'cinema',
        select: 'name address hotline',
      },
    ]);
    if (!getRoom) {
      return 'Get Failed';
    }

    return getRoom;
  }

  async getRoomByMovieAndCinema(movieId: any, cinemaId: any): Promise<any> {
    const getRoom = await this.roomModel
      .find({
        movie: movieId,
        cinema: cinemaId,
      })
      .populate([
        {
          path: 'showtime',
          select: 'date time',
          populate: [{ path: 'time', select: 'time' }],
        },
      ]);

    return getRoom;
  }

  async getRoomByCinema(cinemaId: any): Promise<any> {
    const getRoom = await this.roomModel
      .find({
        cinema: cinemaId,
      })
      .populate([
        { path: 'movie', select: 'name duration release_date' },
        {
          path: 'showtime',
          select: 'date time',
          populate: [{ path: 'time', select: 'time' }],
        },
      ]);

    return getRoom;
  }

  async getCinemaByMovie(movieId: any): Promise<any> {
    const cinemas = await this.roomModel
      .find({ movie: movieId })
      .populate([{ path: 'cinema', select: 'name address hotline' }]);
    return cinemas;
  }

  async updateRoom(roomId: any, dataUpdate: any): Promise<any> {
    const update = await this.roomModel.findByIdAndUpdate(roomId, dataUpdate, {
      new: true,
    });
    if (!update) {
      return {
        status: 'error',
        message: 'Update Failed',
      };
    }
    return update;
  }

  async deleteRoom(roomId: any, password: any): Promise<any> {
    if (password != '8888') {
      return 'You do not have sufficient authority to delete';
    }
    const deleteroom = await this.roomModel.findByIdAndDelete(roomId);
    if (!deleteroom) {
      return {
        status: 'error',
        message: 'Delete Failed',
      };
    }
    return deleteroom;
  }
}
