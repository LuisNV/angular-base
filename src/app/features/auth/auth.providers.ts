import { Provider } from '@angular/core';
import { AuthApi } from './data/data-sources/auth-api.service';
import { HttpAuthRepository } from './data/repositories/http-auth.repository';
import { AuthRepository } from './domain/repositories/auth.repository';
import { LoginUseCase } from './domain/use-cases/login.use-case';
import { LogoutUseCase } from './domain/use-cases/logout.use-case';

export function provideAuth(): Provider[] {
  return [
    AuthApi,
    { provide: AuthRepository, useClass: HttpAuthRepository },
    {
      provide: LoginUseCase,
      useFactory: (repository: AuthRepository) => new LoginUseCase(repository),
      deps: [AuthRepository],
    },
    {
      provide: LogoutUseCase,
      useFactory: (repository: AuthRepository) => new LogoutUseCase(repository),
      deps: [AuthRepository],
    },
  ];
}
