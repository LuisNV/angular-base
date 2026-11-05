import { AuthSession, LoginCredentials } from '../models/auth.models';
import { AuthRepository } from '../repositories/auth.repository';

export class LoginUseCase {
  constructor(private readonly repository: AuthRepository) { }

  execute(credentials: LoginCredentials): Promise<AuthSession> {
    const identifier = credentials.identifier.trim();
    if (!identifier || !credentials.password) {
      return Promise.reject(new Error('Vui lòng nhập tài khoản và mật khẩu.'));
    }
    return this.repository.login({ identifier, password: credentials.password });
  }
}
