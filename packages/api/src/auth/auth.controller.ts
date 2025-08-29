import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { IsString } from 'class-validator';

class StartDto {
  @IsString()
  phone!: string;
}

class VerifyDto {
  @IsString()
  phone!: string;
  @IsString()
  code!: string;
}

@Controller('auth/wa')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('start')
  start(@Body() dto: StartDto) {
    return this.service.start(dto.phone);
  }

  @Post('verify')
  verify(@Body() dto: VerifyDto) {
    const ok = this.service.verify(dto.phone, dto.code);
    if (!ok) return { success: false };
    return { success: true, token: 'jwt-token', refresh: 'refresh-token' };
  }

  @Post('received')
  received(@Body() dto: VerifyDto) {
    return { received: this.service.verify(dto.phone, dto.code) };
  }
}
