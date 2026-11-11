export interface Profile {
    readonly id: number;
    readonly name: string;
    readonly email: string;
    readonly avatarUrl?: string;
    readonly bio?: string;
    readonly createdAt?: string;
    readonly updatedAt?: string;
    readonly role?: string;
    readonly address: string;
    readonly phoneNumber: string;
    readonly birthday: string;
    readonly gender: string;
    readonly emailVerified: boolean;
}