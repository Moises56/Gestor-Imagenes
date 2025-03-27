// images.service.ts
import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import * as fs from 'fs/promises';
import { join } from 'path';
import {
  ImageNotFoundException,
  UnauthorizedImageAccessException,
  FileUploadException,
} from '../../common/exceptions/custom.exceptions';

@Injectable()
export class ImagesService {
  private readonly logger = new Logger(ImagesService.name);

  constructor(private prisma: PrismaService) {}

  async saveImage(
    file: Express.Multer.File,
    createImageDto: CreateImageDto,
    userId: string,
  ) {
    if (!file || !file.filename) throw new Error('File or filename is missing');

    const baseUrl = process.env.BASE_URL || 'https://gestorimg.amdc.hn';
    const url = `${baseUrl}/uploads/${file.filename}`;
    const image = await this.prisma.image.create({
      data: {
        name: createImageDto.name,
        url,
        userId,
        ...(createImageDto.description && {
          description: createImageDto.description,
        }),
      },
    });
    return image;
  }

  async getAllImages(
    page: number,
    limit: number,
    userId?: string,
    userRole?: string,
  ) {
    try {
      const skip = (page - 1) * limit;

      // Si no es admin ni moderador, solo puede ver sus propias imágenes
      const where =
        userRole === 'ADMIN' || userRole === 'MODERATOR' ? {} : { userId };

      const [images, total] = await Promise.all([
        this.prisma.image.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
        }),
        this.prisma.image.count({ where }),
      ]);

      return {
        success: true,
        data: images,
        pagination: {
          total,
          page,
          totalPages: Math.ceil(total / limit),
          hasMore: skip + images.length < total,
        },
      };
    } catch (error) {
      this.logger.error(`Error fetching images: ${error.message}`);
      throw new HttpException(
        'An error occurred while fetching images',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getImageById(id: string, userId: string, userRole: string) {
    const image = await this.prisma.image.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    if (!image) {
      throw new Error('Image not found');
    }

    // Solo el propietario o admin/moderator pueden ver la imagen
    if (
      userRole !== 'ADMIN' &&
      userRole !== 'MODERATOR' &&
      image.userId !== userId
    ) {
      throw new Error('Unauthorized');
    }

    return image;
  }

  async updateImage(
    id: string,
    updateImageDto: UpdateImageDto,
    userId: string,
    userRole: string,
  ) {
    try {
      const image = await this.prisma.image.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });

      if (!image) {
        throw new ImageNotFoundException();
      }

      // Solo el propietario puede actualizar la imagen
      if (image.userId !== userId) {
        throw new UnauthorizedImageAccessException();
      }

      const updatedImage = await this.prisma.image.update({
        where: { id },
        data: updateImageDto,
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });

      return {
        success: true,
        message: 'Image updated successfully',
        data: updatedImage,
      };
    } catch (error) {
      this.logger.error(`Error updating image ${id}: ${error.message}`);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'An error occurred while updating the image',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteImage(id: string, userId: string, userRole: string) {
    try {
      const image = await this.prisma.image.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });

      if (!image) {
        throw new ImageNotFoundException();
      }

      if (image.userId !== userId) {
        throw new UnauthorizedImageAccessException();
      }

      // 1. Obtener el nombre del archivo de la URL
      const fileName = image.url.split('/').pop();
      if (!fileName) {
        throw new FileUploadException('Invalid file name in URL');
      }

      // 2. Construir la ruta completa al archivo
      const filePath = join(process.cwd(), 'uploads', fileName);

      // 3. Intentar eliminar el archivo físico
      try {
        await fs.unlink(filePath);
      } catch (fileError) {
        this.logger.warn(`File not found in uploads folder: ${filePath}`);
        // Continuamos con la eliminación del registro aunque el archivo no exista
      }

      // 4. Eliminar el registro de la base de datos
      await this.prisma.image.delete({
        where: { id },
      });

      return {
        success: true,
        message: 'Image deleted successfully',
        data: {
          id: image.id,
          name: image.name,
          fileName,
          user: image.user,
        },
      };
    } catch (error) {
      this.logger.error(`Error deleting image ${id}: ${error.message}`);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'An error occurred while deleting the image',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
