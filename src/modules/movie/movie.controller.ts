import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { MovieDto } from './dto/movie.dto';
import { AuthAdminGuard } from '../auth/dto/admin.guard';
import mongoose from 'mongoose';
import { AuthGuard } from '../auth/auth.guard';

@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @UseGuards(AuthAdminGuard)
  @Post('')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        {
          name: 'trailer',
          maxCount: 1,
        },
        {
          name: 'image',
          maxCount: 1,
        },
      ],
      {
        storage: diskStorage({
          destination: (req, file, cb) => {
            if (file.mimetype.startsWith('video/')) {
              cb(null, './public/videos');
            } else {
              cb(null, './public/images');
            }
          },

          filename: (req, file, cb) => {
            const filename = file.originalname;
            cb(null, `${filename}`);
          },
        }),
      },
    ),
  )
  async create(
    @Body() movieDto: MovieDto,
    @UploadedFiles()
    files: { trailer?: Express.Multer.File[]; image?: Express.Multer.File[] },
  ): Promise<any> {
    try {
      const created = {
        ...movieDto,
        // director: JSON.parse(movieDto.director),
        // actor: JSON.parse(movieDto.actor),
        // genre: JSON.parse(movieDto.genre),
        image: files.image?.[0]?.filename,
        trailer: files.trailer?.[0].filename,
      };
      const createdMovie = await this.movieService.create(created);

      return {
        createdMovie,
      };
    } catch (error) {
      console.error('Error creating movie:', error);
      return {
        statusCode: 500,
        message: 'Internal Server Error',
      };
    }
  }

  @UseGuards(AuthAdminGuard)
  @Get('admin')
  async getAllmovieForAdmin(@Query('page') page: number): Promise<any> {
    const getall = await this.movieService.getAllmovieForAdmin(page);
    return {
      getall,
    };
  }

  @UseGuards(AuthGuard)
  @Get('user')
  async getAllmovieForUser(): Promise<any> {
    const getall = await this.movieService.getAllmovieForUser();
    return {
      getall,
    };
  }

  @Get('no/login/:id')
  async getMoiveNoLogin(@Param('id') id: any): Promise<any> {
    const getmovie = await this.movieService.getMovie(id);
    return {
      getmovie,
    };
  }

  @Get('no/login')
  async getAllmovieForNoLogin(): Promise<any> {
    const getall = await this.movieService.getAllmovieForUser();
    return {
      getall,
    };
  }

  @UseGuards(AuthGuard)
  @Get('director/:directorId')
  async getMovieByDirector(@Param('directorId') id: any): Promise<any> {
    const getmovie = await this.movieService.getMovieByDirector(id);
    return {
      getmovie,
    };
  }

  @UseGuards(AuthGuard)
  @Get('actor/:actorId')
  async getMovieByActor(@Param('actorId') id: any): Promise<any> {
    const getmovie = await this.movieService.getMovieByActor(id);
    return {
      getmovie,
    };
  }

  @UseGuards(AuthGuard)
  @Get('search/name')
  async getMovieByName(@Query('name') name: any): Promise<any> {
    const getmovie = await this.movieService.searchMovie(name);
    return {
      getmovie,
    };
  }

  @UseGuards(AuthGuard)
  @Get('genre/:genreId')
  async getMovieByGenre(@Param('genreId') genreId: any): Promise<any> {
    const getmovie = await this.movieService.getMovieBygenre(genreId);
    return {
      getmovie,
    };
  }

  @Get('no/login/genre/:genreId')
  async getMovieByGenreNoLogin(@Param('genreId') genreId: any): Promise<any> {
    const getmovie = await this.movieService.getMovieBygenre(genreId);
    return {
      getmovie,
    };
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getMoive(@Param('id') id: any): Promise<any> {
    const getmovie = await this.movieService.getMovie(id);
    return {
      getmovie,
    };
  }

  @UseGuards(AuthGuard)
  @Put('stopshows/:id')
  async updateMovieStopShow(@Param('id') id: any): Promise<any> {
    const getmovie = await this.movieService.updateMovieStopShow(id);
    return {
      getmovie,
    };
  }

  @UseGuards(AuthAdminGuard)
  @Put(':id')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        {
          name: 'trailer',
          maxCount: 1,
        },
        {
          name: 'image',
          maxCount: 1,
        },
      ],
      {
        storage: diskStorage({
          destination: (req, file, cb) => {
            if (file.mimetype.startsWith('video/')) {
              cb(null, './public/videos');
            } else {
              cb(null, './public/images');
            }
          },

          filename: (req, file, cb) => {
            const filename = file.originalname;
            cb(null, `${filename}`);
          },
        }),
      },
    ),
  )
  async update(
    @Param('id') id: string,
    @Body() movieDto: MovieDto,
    @UploadedFiles()
    files: { trailer?: Express.Multer.File[]; image?: Express.Multer.File[] },
  ): Promise<any> {
    try {
      if (files.image === undefined && files.trailer != undefined) {
        const dataUpdate = {
          ...movieDto,
          trailer: files.trailer?.[0].filename,
        };

        const updated = await this.movieService.update(id, dataUpdate);
        return {
          updated,
        };
      } else if (files.trailer === undefined && files.image != undefined) {
        const dataUpdate = {
          ...movieDto,
          image: files.image?.[0]?.filename,
        };

        const updated = await this.movieService.update(id, dataUpdate);
        return {
          updated,
        };
      } else if (files.trailer != undefined && files.image != undefined) {
        const dataUpdate = {
          ...movieDto,
          image: files.image?.[0]?.filename,
          trailer: files.trailer?.[0].filename,
        };

        const updated = await this.movieService.update(id, dataUpdate);
        return {
          updated,
        };
      } else {
        const updated = await this.movieService.update(id, movieDto);
        return {
          updated,
        };
      }
    } catch (error) {
      return error.response;
    }
  }

  @UseGuards(AuthAdminGuard)
  @Delete(':id')
  async deleteMovie(
    @Param('id') id: string,
    @Query('password') password: any,
  ): Promise<any> {
    const deletemovie = await this.movieService.delete(id, password);
    await this.movieService.delete(id, password);
    return {
      deletemovie,
    };
  }
}
