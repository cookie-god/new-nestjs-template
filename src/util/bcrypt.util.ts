import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

export class BcrypUtil {
  private static readonly ROUNDS = 10;
  private static readonly algorithm = 'aes-256-cbc';
  private static readonly key: Buffer = Buffer.from(
    'pXBxdm+Yx6bdAvq5flEFa4jJWNC9RzlwQQAmE3h3oHI=',
    'base64',
  );
  private static readonly iv: Buffer = Buffer.from(
    'LzNx2t9z6eK6U8sH9M9j0A==',
    'base64',
  );

  static async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.ROUNDS);
  }

  static async compare(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  static encrypt(value: number): string {
    const text = value.toString(); // 숫자를 문자열로 변환
    const cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);
    let encrypted = cipher.update(text, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
  }

  // 숫자 복호화
  static decryptNumber(encryptedText: string): number {
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, this.iv);
    let decrypted = decipher.update(encryptedText, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return Number(decrypted); // 복호화한 후 숫자로 변환
  }
}
