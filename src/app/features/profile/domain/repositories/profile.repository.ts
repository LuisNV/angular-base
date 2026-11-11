import { Profile } from '../model/profile.models';
import { UpdateProfileRequestDto } from '../../data/dto/profile.dto';

export abstract class ProfileRepository {
    abstract getProfile(): Promise<Profile>;
    abstract uploadAvatar(file: File): Promise<Profile>;
    abstract updateProfile(profile: Partial<UpdateProfileRequestDto>): Promise<Profile>;
}
