import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateImageDto } from './dto/create-image.dto';

@Injectable()
export class ImagesService {
  constructor(private prisma: PrismaService) {}

  async saveImage(file: Express.Multer.File, createImageDto: CreateImageDto) {
    const url = `http://localhost:3000/uploads/${file.filename}`;
    const image = await this.prisma.image.create({
      data: {
        name: createImageDto.name,
        url,
        // Si añades más campos en el DTO, agrégalos aquí
        ...(createImageDto.description && {
          description: createImageDto.description,
        }),
      },
    });
    return image.url;
  }
}
