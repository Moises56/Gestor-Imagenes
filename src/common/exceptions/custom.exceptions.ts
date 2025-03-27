import { HttpException, HttpStatus } from '@nestjs/common';

export class ImageNotFoundException extends HttpException {
  constructor() {
    super('Image not found', HttpStatus.NOT_FOUND);
  }
}

export class UnauthorizedImageAccessException extends HttpException {
  constructor() {
    super('You are not authorized to access this image', HttpStatus.FORBIDDEN);
  }
}

export class FileUploadException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST);
  }
} 