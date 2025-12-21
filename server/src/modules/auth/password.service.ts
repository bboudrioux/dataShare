import * as bcrypt from 'bcrypt';

export class PasswordService {
  private static readonly SALT_ROUNDS = 10;

  static hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  static compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
