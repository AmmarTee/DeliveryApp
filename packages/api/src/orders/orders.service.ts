import { Injectable } from '@nestjs/common';
import { PrismaService } from '../config/prisma.service.js';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService, private s3: S3Client) {}

  updateStatus(id: string, status: string) {
    return this.prisma.order.update({ where: { id }, data: { status } });
  }

  async uploadProof(id: string, buffer: Buffer, filename: string) {
    const bucket = process.env.S3_BUCKET || 'deliveryapp';
    await this.s3.send(new PutObjectCommand({ Bucket: bucket, Key: filename, Body: buffer }));
    return this.prisma.order.update({ where: { id }, data: { status: 'proof_submitted' } });
  }
}
