import { Injectable } from '@nestjs/common';
import { PrismaService } from '../config/prisma.service.js';

@Injectable()
export class ListsService {
  constructor(private prisma: PrismaService) {}

  create(userId: string, rawText: string) {
    return this.prisma.groceryList.create({ data: { userId, rawText } });
  }

  findOne(id: string) {
    return this.prisma.groceryList.findUnique({ where: { id } });
  }
}
