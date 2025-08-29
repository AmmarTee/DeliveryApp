import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ReviewsService } from './reviews.service.js';
import { IsInt, Max, Min } from 'class-validator';

class ReviewDto {
  @IsInt()
  @Min(1)
  @Max(5)
  rating!: number;
}

@Controller()
export class ReviewsController {
  constructor(private readonly service: ReviewsService) {}

  @Post('orders/:id/review')
  review(@Param('id') id: string, @Body() dto: ReviewDto) {
    return this.service.create(id, dto.rating);
  }

  @Get('merchants/:id/rating')
  rating(@Param('id') id: string) {
    return this.service.ratingForMerchant(id);
  }
}
