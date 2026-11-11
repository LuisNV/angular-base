import { ProfileRepository } from '../repositories/profile.repository';
import { Profile } from '../model/profile.models';
import { UpdateProfileRequestDto } from '../../data/dto/profile.dto';

export class ProfileUseCase {
    constructor(private readonly repository: ProfileRepository) { }

    execute(): Promise<Profile> {
        return this.repository.getProfile();
    }
    executeUploadAvatar(file: File): Promise<Profile> {
        return this.repository.uploadAvatar(file);
    }
    executeUpdateProfile(profile: Partial<UpdateProfileRequestDto>): Promise<Profile> {
        return this.repository.updateProfile(profile);
    }
}