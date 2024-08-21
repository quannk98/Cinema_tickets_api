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
import { RoomService } from './room.service';
import { RoomDto } from './dto/room.dto';
import { AuthAdminGuard } from '../auth/dto/admin.guard';
import { AuthGuard } from '../auth/auth.guard';

@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @UseGuards(AuthAdminGuard)
  @Post('')
  async create(@Body() roomDto: RoomDto): Promise<any> {
    try {
      const create = await this.roomService.createRoom(roomDto);
      return {
        create,
      };
    } catch (error) {
      return error.reponse;
    }
  }

  @UseGuards(AuthAdminGuard)
  @Get('')
  async getAll(@Query('page') page: any): Promise<any> {
    const getall = await this.roomService.getAllroom(page);
    return {
      getall,
    };
  }

  @UseGuards(AuthGuard)
  @Get('cinema/:movieId')
  async getCinemaByMoive(@Param('movieId') id: any): Promise<any> {
    const cinemas = await this.roomService.getCinemaByMovie(id);
    return cinemas;
  }

  @Get('cinema/no/login/:movieId')
  async getCinemaByMoiveNoLogin(@Param('movieId') id: any): Promise<any> {
    const cinemas = await this.roomService.getCinemaByMovie(id);
    return cinemas;
  }

  @UseGuards(AuthAdminGuard)
  @Get('room/cinema')
  async getRoomByCinema(@Query('cinemaId') cinemaId): Promise<any> {
    const getRoom = await this.roomService.getRoomByCinema(cinemaId);
    return getRoom;
  }

  @UseGuards(AuthGuard)
  @Get('room')
  async getRoomByMovie(
    @Query('cinemaId') cinemaId,
    @Query('movieId') movieId,
  ): Promise<any> {
    const getRoombymovie = await this.roomService.getRoomByMovieAndCinema(
      movieId,
      cinemaId,
    );
    return {
      getRoombymovie,
    };
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getRoom(@Param('id') id: any): Promise<any> {
    const getRoom = await this.roomService.getroom(id);
    return {
      getRoom,
    };
  }

  @UseGuards(AuthAdminGuard)
  @Put(':id')
  async update(@Param('id') id: any, @Body() roomDto: RoomDto): Promise<any> {
    try {
      const updated = await this.roomService.updateRoom(id, roomDto);
      return {
        updated,
      };
    } catch (error) {
      return error.reponse;
    }
  }

  @UseGuards(AuthAdminGuard)
  @Delete(':id')
  async deleteRoom(
    @Param('id') id: any,
    @Query('password') password: any,
  ): Promise<any> {
    const deletetime = await this.roomService.deleteRoom(id, password);
    await this.roomService.deleteRoom(id, password);
    return {
      deletetime,
    };
  }
}
