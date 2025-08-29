import { Injectable } from '@nestjs/common';
import { PrismaService } from '../config/prisma.service.js';

@Injectable()
export class QuotesService {
  constructor(private prisma: PrismaService) {}

  async requestQuotes(listId: string, merchantIds: string[]) {
    const quotes = await Promise.all(
      merchantIds.map((m) =>
        this.prisma.quote.create({ data: { listId, merchantId: m, total: 0 } })
      )
    );
    return quotes;
  }

  findForList(listId: string) {
    return this.prisma.quote.findMany({ where: { listId } });
  }

  submitQuote(id: string, total: number) {
    return this.prisma.quote.update({ where: { id }, data: { total, status: 'submitted' } });
  }

  accept(id: string) {
    return this.prisma.order.create({ data: { quoteId: id, status: 'pending' } });
  }
}
