// images.controller.ts
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  Get,
  Put,
  Delete,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ImagesService } from './images.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GetUser } from '../../auth/decorators/get-user.decorator';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}-${file.originalname}`);
        },
      }),
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() createImageDto: CreateImageDto,
    @GetUser() user: any,
  ) {
    if (!file) throw new Error('No file uploaded');
    const image = await this.imagesService.saveImage(
      file,
      createImageDto,
      user.id,
    );
    return image;
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllImages(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '12',
    @GetUser() user: any,
  ) {
    const pageNum = parseInt(page, 12) || 1;
    const limitNum = parseInt(limit, 12) || 12;
    return this.imagesService.getAllImages(
      pageNum,
      limitNum,
      user.id,
      user.role,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getImageById(@Param('id') id: string, @GetUser() user: any) {
    return this.imagesService.getImageById(id, user.id, user.role);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateImage(
    @Param('id') id: string,
    @Body() updateImageDto: UpdateImageDto,
    @GetUser() user: any,
  ) {
    return this.imagesService.updateImage(
      id,
      updateImageDto,
      user.id,
      user.role,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteImage(@Param('id') id: string, @GetUser() user: any) {
    return this.imagesService.deleteImage(id, user.id, user.role);
  }
}
