import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateImageDto } from './dto/create-image.dto';

@Injectable()
export class ImagesService {
  constructor(private prisma: PrismaService) {}

  async saveImage(file: Express.Multer.File, createImageDto: CreateImageDto) {
    if (!file || !file.filename) {
      throw new Error('File or filename is missing');
    }

    const url = `http://localhost:3000/uploads/${file.filename}`;
    const image = await this.prisma.image.create({
      data: {
        name: createImageDto.name,
        url,
        ...(createImageDto.description && {
          description: createImageDto.description,
        }),
      },
    });
    return image.url;
  }

  async getAllImages(): Promise<CreateImageDto[]> {
    const images = await this.prisma.image.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Mapea los resultados de Prisma al DTO
    return images.map((image) => ({
      id: image.id,
      name: image.name,
      url: image.url,
      description: image.description,
      createdAt: image.createdAt,
    }));
  }
}
