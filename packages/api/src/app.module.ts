import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './config/prisma.service.js';
import { AuthModule } from './auth/auth.module.js';
import { ListsModule } from './lists/lists.module.js';
import { QuotesModule } from './quotes/quotes.module.js';
import { OrdersModule } from './orders/orders.module.js';
import { ReviewsModule } from './reviews/reviews.module.js';
import { HealthModule } from './health/health.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    ListsModule,
    QuotesModule,
    OrdersModule,
    ReviewsModule,
    HealthModule
  ],
  providers: [PrismaService],
})
export class AppModule {}
