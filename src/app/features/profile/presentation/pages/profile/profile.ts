import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../../core/services/auth.service';
import { NotifyService } from '../../../../../core/services/notify.service';
import { LoadingService } from '../../../../../core/services/loading.service';
import { ProfileUseCase } from '../../../domain/use-case/profile.use-case';
import { LogoutUseCase } from '../../../../auth/domain/use-cases/logout.use-case';
import { UpdateProfileRequestDto } from '../../../data/dto/profile.dto';


@Component({
  selector: 'app-profile',
  imports: [FormsModule, DialogModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Profile {
  readonly editing = signal(false);
  readonly emailPasswordOpen = signal(false);
  readonly passwordError = signal('');
  readonly emailError = signal('');
  readonly saving = signal(false);
  emailPassword = '';

  closeEmailPassword(): void {
    this.emailPasswordOpen.set(false);
    this.emailPassword = '';
    this.passwordError.set('');
  }
  readonly activeTab = signal('personal');
  readonly avatar = signal('images/avatar.png');
  readonly passwordOpen = signal(false);
  readonly notifications = signal(true);
  readonly reminder = signal(true);
  private readonly loading = inject(LoadingService);
  private readonly notify = inject(NotifyService);
  private readonly profileUseCase = inject(ProfileUseCase);
  private readonly logoutUseCase = inject(LogoutUseCase);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  readonly profile = signal({
    name: '',
    email: '',
    phone: '',
    birthday: '',
    gender: '',
    region: '',
    avatarUrl: '',
    emailVerified: false
  });
  draft = { ...this.profile() };
  readonly tabs = [
    { id: 'personal', icon: 'person', label: 'Thông tin cá nhân' },
    { id: 'security', icon: 'lock', label: 'Bảo mật tài khoản' },
    { id: 'membership', icon: 'workspace_premium', label: 'Gói thành viên' },
    { id: 'notifications', icon: 'notifications', label: 'Thông báo' },
    { id: 'settings', icon: 'settings', label: 'Cài đặt' },
  ];
  async logout(): Promise<void> {
    await this.logoutUseCase.execute(this.auth.getRefreshToken() ?? '');
    this.auth.clearSession();
    void this.router.navigateByUrl('/login', { replaceUrl: true });
  }

  edit(): void {
    this.draft = { ...this.profile() };
    this.emailError.set('');
    this.closeEmailPassword();
    this.editing.set(true);
  }
  save(): void {
    if (this.saving()) return;
    if (this.emailPasswordOpen() && !this.emailPassword) {
      this.passwordError.set('Vui lòng nhập mật khẩu hiện tại.');
      return;
    }
    this.emailError.set('');
    this.passwordError.set('');
    const profileData: Partial<UpdateProfileRequestDto> = {
      fullName: this.draft.name,
      ...(this.draft.email !== this.profile().email ? { email: this.draft.email } : {}),
      ...(this.emailPasswordOpen() ? { currentPassword: this.emailPassword } : {}),
      phone: this.draft.phone,
      dateOfBirth: this.draft.birthday,
      gender: this.draft.gender,
      address: this.draft.region,
      avatarUrl: this.draft.avatarUrl,
    };
    this.saving.set(true);
    this.profileUseCase.executeUpdateProfile(profileData).then(profile => {
      this.profile.set({
        name: profile.name,
        email: profile.email,
        phone: profile.phoneNumber,
        birthday: profile.birthday?.split('T')[0] ?? '',
        gender: profile.gender ?? '',
        region: profile.address,
        avatarUrl: profile.avatarUrl ?? '',
        emailVerified: profile.emailVerified ?? false,
      });
      this.draft = { ...this.profile() };
      this.editing.set(false);
      this.closeEmailPassword();
      this.notify.success('Thành công', 'Đã cập nhật thông tin cá nhân.');
    }).catch((error: unknown) => {
      if (error instanceof HttpErrorResponse) {
        const code = error.error?.code;
        if ((error.status === 409 && code === 1001) || (error.status === 400 && code === 1002)) {
          this.emailPassword = '';
          this.passwordError.set(code === 1002
            ? 'Mật khẩu không đúng. Vui lòng thử lại.'
            : '');
          this.emailPasswordOpen.set(true);
          return;
        }
        if (error.status === 409 && code === 1003) {
          this.closeEmailPassword();
          this.emailError.set('Email đã được sử dụng. Vui lòng chọn email khác.');
          return;
        }
        // Other HTTP errors are displayed by the global error interceptor.
        return;
      }
      this.notify.error('Có lỗi xảy ra', 'Không thể cập nhật thông tin cá nhân. Vui lòng thử lại.');
    }).finally(() => this.saving.set(false));
  }
  changeAvatar(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/') || file.size > 5 * 1024 * 1024) {
      this.notify.warn('Ảnh không hợp lệ', 'Vui lòng chọn tệp ảnh không quá 5 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => this.avatar.set(String(reader.result));
    reader.readAsDataURL(file);
    this.profileUseCase.executeUploadAvatar(file).then(profile => {
      this.avatar.set(profile.avatarUrl?.trim() || 'images/avatar.png');
      this.profile.set({
        name: profile.name,
        email: profile.email,
        phone: profile.phoneNumber,
        birthday: profile.birthday?.split('T')[0] ?? '',
        gender: profile.gender ?? '',
        region: profile.address,
        avatarUrl: profile.avatarUrl ?? '',
        emailVerified: profile.emailVerified ?? false,
      });
      this.draft = { ...this.profile() };
    }).catch(() => {
      this.notify.error('Có lỗi xảy ra', 'Không thể cập nhật ảnh đại diện. Vui lòng thử lại.');
    });
  }
  birthday(): string {
    const value = this.profile().birthday;
    if (!value) return 'Chưa cập nhật';
    const [year, month, day] = value.split('-');
    return `${day}/${month}/${year}`;
  }
  genderLabel(): string {
    switch (this.profile().gender) {
      case 'MALE': return 'Nam';
      case 'FEMALE': return 'Nữ';
      case 'OTHER': return 'Khác';
      default: return 'Chưa cập nhật';
    }
  }
  async ngOnInit(): Promise<void> {
    const finish = this.loading.show();
    try {
      const profile = await this.profileUseCase.execute();
      this.avatar.set(profile.avatarUrl?.trim() || 'images/avatar.png');
      this.profile.set({
        name: profile.name,
        email: profile.email,
        phone: profile.phoneNumber,
        birthday: profile.birthday?.split('T')[0] ?? '',
        gender: profile.gender ?? '',
        region: profile.address,
        avatarUrl: profile.avatarUrl ?? '',
        emailVerified: profile.emailVerified ?? false,
      });
      this.draft = { ...this.profile() };
    } catch {
      this.notify.error('Có lỗi xảy ra', 'Không thể tải thông tin cá nhân. Vui lòng thử lại.');
    } finally {
      finish();
    }
  }
}
