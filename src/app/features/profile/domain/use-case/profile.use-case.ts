import { ProfileRepository } from '../repositories/profile.repository';
import { Profile } from '../model/profile.models';

export class ProfileUseCase {
    constructor(private readonly repository: ProfileRepository) { }

    execute(): Promise<Profile> {
        return this.repository.getProfile();
    }
}