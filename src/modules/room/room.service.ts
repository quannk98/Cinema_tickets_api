import { Injectable } from '@nestjs/common';
import { RoomReponsitory } from 'src/repositories/room.reponsitory';
import { RoomDto } from './dto/room.dto';

@Injectable()
export class RoomService {
  constructor(private readonly roomReponsitory: RoomReponsitory) {}
  async createRoom(roomDto: RoomDto): Promise<any> {
    const room = await this.roomReponsitory.createRoom(roomDto);
    return room;
  }

  async getAllroom(page: any): Promise<any> {
    const getall = await this.roomReponsitory.getAllroom(page);
    return getall;
  }
  async getroom(roomId: any): Promise<any> {
    const getRoom = await this.roomReponsitory.getroom(roomId);
    return getRoom;
  }

  async getRoomByMovieAndCinema(movieId: any, cinemaId: any): Promise<any> {
    const getroom = await this.roomReponsitory.getRoomByMovieAndCinema(
      movieId,
      cinemaId,
    );
    return getroom;
  }

  async getRoomByCinema(cinemaId: any): Promise<any> {
    const getroom = await this.roomReponsitory.getRoomByCinema(cinemaId);
    return getroom;
  }

  async getCinemaByMovie(movieId: any): Promise<any> {
    const cinemas = await this.roomReponsitory.getCinemaByMovie(movieId);
    return cinemas;
  }

  async updateRoom(roomId: any, dataUpdate): Promise<any> {
    const update = await this.roomReponsitory.updateRoom(roomId, dataUpdate);
    return update;
  }

  async deleteRoom(roomId: any, password: any): Promise<any> {
    const deleteRoom = await this.roomReponsitory.deleteRoom(roomId, password);
    return deleteRoom;
  }
}
