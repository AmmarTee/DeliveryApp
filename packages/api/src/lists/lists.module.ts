import { Module } from '@nestjs/common';
import { ListsService } from './lists.service.js';
import { ListsController } from './lists.controller.js';
import { PrismaService } from '../config/prisma.service.js';

@Module({
  controllers: [ListsController],
  providers: [ListsService, PrismaService]
})
export class ListsModule {}
