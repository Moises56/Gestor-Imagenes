// images.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import * as fs from 'fs/promises';
import { join } from 'path';

@Injectable()
export class ImagesService {
  constructor(private prisma: PrismaService) {}

  async saveImage(file: Express.Multer.File, createImageDto: CreateImageDto) {
    if (!file || !file.filename) throw new Error('File or filename is missing');

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
    return image;
  }

  async getAllImages(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [images, total] = await Promise.all([
      this.prisma.image.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.image.count(),
    ]);

    return {
      data: images,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async updateImage(id: number, updateImageDto: UpdateImageDto) {
    return this.prisma.image.update({
      where: { id },
      data: updateImageDto,
    });
  }

  async deleteImage(id: number) {
    const image = await this.prisma.image.delete({ where: { id } });
    const filePath = join(
      __dirname,
      '..',
      '..',
      'uploads',
      image.url.split('/').pop()!,
    );
    await fs
      .unlink(filePath)
      .catch(() => console.warn('File not found for deletion'));
    return { message: 'Image deleted successfully' };
  }
}
