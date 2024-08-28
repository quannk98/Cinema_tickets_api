import { Injectable } from '@nestjs/common';
import { ShowtimeReponsitory } from 'src/repositories/showtime.reponsitory';
import { ShowtimeDto } from './dto/showtime.dto';
import { Showtime } from 'src/schemas/showtime.schema';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class ShowtimeService {
  constructor(private readonly showtimeReponsitory: ShowtimeReponsitory) {}
  async createShowtime(showtimeDto: ShowtimeDto): Promise<Showtime> {
    const showtime = await this.showtimeReponsitory.createShowtime(showtimeDto);
    return showtime;
  }

  async getAllshowtime(page: number): Promise<Showtime> {
    const getall = await this.showtimeReponsitory.getAllShowtime(page);
    return getall;
  }
  async getAllShowtimeUser(): Promise<Showtime> {
    const getall = await this.showtimeReponsitory.getAllShowtimeUser();
    return getall;
  }

  async getshowtime(showtimeId: any): Promise<Showtime> {
    const getShowtime = await this.showtimeReponsitory.getShowtime(showtimeId);
    return getShowtime;
  }

  async updateShowtime(
    showtimeId: any,
    showtimeDto: ShowtimeDto,
  ): Promise<Showtime> {
    const update = await this.showtimeReponsitory.updateShowtime(
      showtimeId,
      showtimeDto,
    );
    return update;
  }

  // @Cron('45 * * * * *')
  // async checkShowtime(): Promise<any> {
  //   await this.showtimeReponsitory.checkShowtime();
  // }

  async deleteShowtime(showtimeId: any, password: any): Promise<Showtime> {
    const deleteShowtime = await this.showtimeReponsitory.deleteShowtime(
      showtimeId,
      password,
    );
    return deleteShowtime;
  }
}
