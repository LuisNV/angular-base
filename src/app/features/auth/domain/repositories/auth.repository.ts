import { AuthSession, LoginCredentials } from '../models/auth.models';

export abstract class AuthRepository {
  abstract login(credentials: LoginCredentials): Promise<AuthSession>;
  abstract logout(refreshToken: string): Promise<void>;
}
