export interface ProfileResponseDto {
    id: number;
    fullName: string;
    email: string;
    phone: string;
    address: string;
    dateOfBirth: string;
    gender: string;
    avatarUrl: string | null;
    emailVerified: boolean;
}
export interface UpdateProfileRequestDto {
    currentPassword?: string;
    fullName?: string;
    email?: string;
    phone?: string;
    address?: string;
    dateOfBirth?: string;
    gender?: string;
    avatarUrl?: string | null;
}
