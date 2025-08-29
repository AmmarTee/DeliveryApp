import { Body, Controller, Param, Post, Get } from '@nestjs/common';
import { ListsService } from './lists.service.js';
import { IsString, IsOptional } from 'class-validator';

class CreateListDto {
  @IsString()
  userId!: string;

  @IsString()
  @IsOptional()
  raw_text?: string;
}

@Controller('lists')
export class ListsController {
  constructor(private readonly service: ListsService) {}

  @Post()
  create(@Body() dto: CreateListDto) {
    return this.service.create(dto.userId, dto.raw_text || '');
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.service.findOne(id);
  }
}
