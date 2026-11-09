import { AuthSession, LoginCredentials } from '../models/auth.models';
import { AuthRepository } from '../repositories/auth.repository';

export class LogoutUseCase {
    constructor(private readonly repository: AuthRepository) { }

    execute(refreshToken: string): Promise<void> {
        if (!refreshToken || !refreshToken.trim()) {
            return Promise.reject(new Error('Vui lòng cung cấp refresh token.'));
        }
        return this.repository.logout(refreshToken);
    }
}
