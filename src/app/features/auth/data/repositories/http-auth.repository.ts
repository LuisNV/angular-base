import { inject, Injectable } from '@angular/core';
import { AuthSession, LoginCredentials } from '../../domain/models/auth.models';
import { AuthRepository } from '../../domain/repositories/auth.repository';
import { AuthApi } from '../data-sources/auth-api.service';

@Injectable()
export class HttpAuthRepository extends AuthRepository {
  private readonly api = inject(AuthApi);

  override async login(credentials: LoginCredentials): Promise<AuthSession> {
    const response = await this.api.login({
      identifier: credentials.identifier,
      password: credentials.password,
    });
    if (typeof response?.accessToken !== 'string' || !response.accessToken.trim()) {
      throw new Error('Phản hồi đăng nhập không hợp lệ.');
    }
    return { accessToken: response.accessToken };
  }
}
