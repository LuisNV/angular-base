import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiClient } from '../../../../core/services/api-client.service';
import { ProfileResponseDto, UpdateProfileRequestDto } from '../dto/profile.dto';

@Injectable()
export class ProfileApi {
    private readonly api = inject(ApiClient);

    getProfile(): Promise<ProfileResponseDto> {
        return firstValueFrom(this.api.get<ProfileResponseDto>('/auth/me'));
    }
    uploadAvatar(file: File): Promise<ProfileResponseDto> {
        const formData = new FormData();
        formData.append('file', file);
        return firstValueFrom(this.api.post<ProfileResponseDto>('/users/me/avatar', formData));
    }
    updateProfile(profile: Partial<UpdateProfileRequestDto>): Promise<ProfileResponseDto> {
        return firstValueFrom(this.api.put<ProfileResponseDto>('/users/me', profile));
    }
}
