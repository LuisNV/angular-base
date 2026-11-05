import { Provider } from '@angular/core';
import { AuthApi } from './data/data-sources/auth-api.service';
import { HttpAuthRepository } from './data/repositories/http-auth.repository';
import { AuthRepository } from './domain/repositories/auth.repository';
import { LoginUseCase } from './domain/use-cases/login.use-case';

export function provideAuth(): Provider[] {
  return [
    AuthApi,
    { provide: AuthRepository, useClass: HttpAuthRepository },
    {
      provide: LoginUseCase,
      useFactory: (repository: AuthRepository) => new LoginUseCase(repository),
      deps: [AuthRepository],
    },
  ];
}
