import * as bcrypt from 'bcrypt';

export class BcrypUtil {
  private static readonly ROUNDS = 10;

  static async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.ROUNDS);
  }

  static async compare(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
