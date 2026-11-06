import { Provider } from '@angular/core';
import { ProfileApi } from './data/data-sources/profile-api.service';
import { HttpProfileRepository } from './data/repositories/http-profile.repository';
import { ProfileRepository } from './domain/repositories/profile.repository';
import { ProfileUseCase } from './domain/use-case/profile.use-case';


export function provideProfile(): Provider[] {
    return [
        ProfileApi,
        { provide: ProfileRepository, useClass: HttpProfileRepository },
        {
            provide: ProfileUseCase,
            useFactory: (repository: ProfileRepository) => new ProfileUseCase(repository),
            deps: [ProfileRepository],
        },
    ];
}
