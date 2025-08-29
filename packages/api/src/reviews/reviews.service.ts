import { Injectable } from '@nestjs/common';
import { PrismaService } from '../config/prisma.service.js';
import { subDays } from 'date-fns';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  create(orderId: string, rating: number) {
    return this.prisma.review.create({ data: { orderId, rating } });
  }

  async ratingForMerchant(merchantId: string) {
    const since = subDays(new Date(), 90);
    const reviews = await this.prisma.review.findMany({
      where: { order: { quote: { merchantId } }, createdAt: { gte: since } }
    });
    const avg =
      reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1);
    return { rating: avg };
  }
}
