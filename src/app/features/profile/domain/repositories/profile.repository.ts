import { Profile } from '../model/profile.models';

export abstract class ProfileRepository {
    abstract getProfile(): Promise<Profile>;
}
