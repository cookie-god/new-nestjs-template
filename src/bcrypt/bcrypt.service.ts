import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class BcryptService {
  private readonly ROUNDS = 10;
  private readonly algorithm = 'aes-256-cbc';
  private readonly key: Buffer;
  private readonly iv: Buffer;
  constructor(private readonly configService: ConfigService) {
    this.key = Buffer.from(
      this.configService.get<string>('ID_SECRET_KEY'),
      'base64',
    );
    this.iv = Buffer.from(
      this.configService.get<string>('ID_SECRET_IV'),
      'base64',
    );
  }

  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.ROUNDS);
  }

  async compare(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  encrypt(value: number): string {
    const text = value.toString(); // 숫자를 문자열로 변환
    const cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);
    let encrypted = cipher.update(text, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
  }

  decryptNumber(encryptedText: string): number {
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, this.iv);
    let decrypted = decipher.update(encryptedText, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return Number(decrypted); // 복호화한 후 숫자로 변환
  }
}
