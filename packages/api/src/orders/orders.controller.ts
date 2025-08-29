import { Controller, Param, Post, Body, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { OrdersService } from './orders.service.js';
import { IsString } from 'class-validator';

class StatusDto {
  @IsString()
  status!: string;
}

@Controller('merchant/orders')
export class OrdersController {
  constructor(private readonly service: OrdersService) {}

  @Post(':id/status')
  update(@Param('id') id: string, @Body() dto: StatusDto) {
    return this.service.updateStatus(id, dto.status);
  }

  @Post(':id/proof')
  @UseInterceptors(FileInterceptor('file'))
  proof(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
    return this.service.uploadProof(id, file.buffer, file.originalname);
  }
}
