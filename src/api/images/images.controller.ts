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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ImagesService } from './images.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

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
  ) {
    if (!file) throw new Error('No file uploaded');
    const image = await this.imagesService.saveImage(file, createImageDto);
    return image;
  }

  @Get()
  async getAllImages(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    return this.imagesService.getAllImages(pageNum, limitNum);
  }

  @Put(':id')
  async updateImage(
    @Param('id') id: string,
    @Body() updateImageDto: UpdateImageDto,
  ) {
    return this.imagesService.updateImage(parseInt(id), updateImageDto);
  }

  @Delete(':id')
  async deleteImage(@Param('id') id: string) {
    return this.imagesService.deleteImage(parseInt(id));
  }
}
