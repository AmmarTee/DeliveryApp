import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { QuotesService } from './quotes.service.js';
import { IsArray, IsNumber, IsString } from 'class-validator';

class RequestQuotesDto {
  @IsArray()
  merchant_ids!: string[];
}

class SubmitQuoteDto {
  @IsNumber()
  total!: number;
}

@Controller()
export class QuotesController {
  constructor(private readonly service: QuotesService) {}

  @Post('lists/:id/request-quotes')
  request(@Param('id') id: string, @Body() dto: RequestQuotesDto) {
    return this.service.requestQuotes(id, dto.merchant_ids);
  }

  @Get('lists/:id/quotes')
  quotes(@Param('id') id: string) {
    return this.service.findForList(id);
  }

  @Post('merchant/quotes/:id')
  submit(@Param('id') id: string, @Body() dto: SubmitQuoteDto) {
    return this.service.submitQuote(id, dto.total);
  }

  @Post('quotes/:id/accept')
  accept(@Param('id') id: string) {
    return this.service.accept(id);
  }
}
