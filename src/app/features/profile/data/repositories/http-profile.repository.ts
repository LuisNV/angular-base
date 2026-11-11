import { inject, Injectable } from '@angular/core';
import { ProfileApi } from '../data-sources/profile-api.service';
import { ProfileRepository } from '../../domain/repositories/profile.repository';
import { Profile } from '../../domain/model/profile.models';
import { UpdateProfileRequestDto } from '../dto/profile.dto';

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
      birthday: response.dateOfBirth,
      gender: response.gender ?? '',
      avatarUrl: response.avatarUrl ?? '',
      emailVerified: response.emailVerified ?? false,
    };
  }
  override async uploadAvatar(file: File): Promise<Profile> {
    const response = await this.api.uploadAvatar(file);
    if (!response || typeof response.id !== 'number') {
      throw new Error('Phản hồi hồ sơ không hợp lệ.');
    }
    return {
      id: response.id,
      name: response.fullName,
      email: response.email,
      address: response.address,
      phoneNumber: response.phone,
      birthday: response.dateOfBirth,
      gender: response.gender ?? '',
      avatarUrl: response.avatarUrl ?? '',
      emailVerified: response.emailVerified ?? false,
    };
  }
  override async updateProfile(profile: Partial<UpdateProfileRequestDto>): Promise<Profile> {
    const response = await this.api.updateProfile(profile);
    if (!response || typeof response.id !== 'number') {
      throw new Error('Phản hồi hồ sơ không hợp lệ.');
    }
    return {
      id: response.id,
      name: response.fullName,
      email: response.email,
      emailVerified: response.emailVerified ?? false,
      address: response.address,
      phoneNumber: response.phone,
      birthday: response.dateOfBirth,
      gender: response.gender ?? '',
      avatarUrl: response.avatarUrl ?? '',
    };
  }

}
