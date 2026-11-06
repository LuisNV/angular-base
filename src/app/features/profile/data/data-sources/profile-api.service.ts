import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiClient } from '../../../../core/services/api-client.service';
import { ProfileResponseDto } from '../dto/profile.dto';

@Injectable()
export class ProfileApi {
    private readonly api = inject(ApiClient);

    getProfile(): Promise<ProfileResponseDto> {
        return firstValueFrom(this.api.get<ProfileResponseDto>('/auth/me'));
    }
}
