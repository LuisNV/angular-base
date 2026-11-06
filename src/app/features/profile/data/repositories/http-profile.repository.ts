import { inject, Injectable } from '@angular/core';
import { ProfileApi } from '../data-sources/profile-api.service';
import { ProfileRepository } from '../../domain/repositories/profile.repository';
import { Profile } from '../../domain/model/profile.models';

@Injectable()
export class HttpProfileRepository extends ProfileRepository {
  private readonly api = inject(ProfileApi);

  override async getProfile(): Promise<Profile> {
    const response = await this.api.getProfile();
    if (!response || typeof response.id !== 'number') {
      throw new Error('Phản hồi hồ sơ không hợp lệ.');
    }
    return {
      id: response.id,
      name: response.fullName,
      email: response.email,
      address: response.address,
      phoneNumber: response.phone,
    };
  }
}
