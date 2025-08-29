import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service.js';
import { OrdersController } from './orders.controller.js';
import { PrismaService } from '../config/prisma.service.js';
import { S3Client } from '@aws-sdk/client-s3';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, PrismaService, {
    provide: S3Client,
    useFactory: () => new S3Client({
      region: 'us-east-1',
      endpoint: process.env.S3_ENDPOINT,
      forcePathStyle: true,
      credentials: { accessKeyId: process.env.S3_ACCESS_KEY || '', secretAccessKey: process.env.S3_SECRET_KEY || '' }
    })
  }]
})
export class OrdersModule {}
