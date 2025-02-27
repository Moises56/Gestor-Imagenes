import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      // Opcional: Puedes configurar opciones adicionales aquí
      log: ['query', 'info', 'warn', 'error'],
    });
  }

  async onModuleInit() {
    await this.$connect(); // Conecta a la base de datos al iniciar el módulo
  }

  async onModuleDestroy() {
    await this.$disconnect(); // Desconecta al destruir el módulo
  }
}
