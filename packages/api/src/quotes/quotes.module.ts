import { Module } from '@nestjs/common';
import { QuotesService } from './quotes.service.js';
import { QuotesController } from './quotes.controller.js';
import { PrismaService } from '../config/prisma.service.js';

@Module({
  controllers: [QuotesController],
  providers: [QuotesService, PrismaService]
})
export class QuotesModule {}
