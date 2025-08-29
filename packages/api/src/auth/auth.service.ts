import { Injectable } from '@nestjs/common';

interface CodeEntry {
  code: string;
  expires: number;
}

@Injectable()
export class AuthService {
  private codes = new Map<string, CodeEntry>();

  start(phone: string) {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const ttl = parseInt(process.env.WA_CODE_TTL_SECONDS || '300', 10);
    this.codes.set(phone, { code, expires: Date.now() + ttl * 1000 });
    const waDeepLink = `https://wa.me/${process.env.WA_VERIFICATION_NUMBER}?text=${encodeURIComponent(process.env.WA_MESSAGE_TEMPLATE?.replace('{{CODE}}', code) || code)}`;
    return { code, waDeepLink };
  }

  verify(phone: string, code: string) {
    const entry = this.codes.get(phone);
    if (!entry) return false;
    if (entry.code !== code) return false;
    if (Date.now() > entry.expires) return false;
    this.codes.delete(phone);
    return true;
  }
}
