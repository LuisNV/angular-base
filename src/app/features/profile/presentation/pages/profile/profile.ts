import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../../core/services/auth.service';
import { LoadingService } from '../../../../../core/services/loading.service';
import { ProfileUseCase } from '../../../domain/use-case/profile.use-case';
import { LogoutUseCase } from '../../../../auth/domain/use-cases/logout.use-case';


@Component({
  selector: 'app-profile',
  imports: [FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Profile {
  readonly editing = signal(false);
  readonly activeTab = signal('personal');
  readonly avatar = signal('images/avatar.png');
  readonly notice = signal('');
  readonly passwordOpen = signal(false);
  readonly notifications = signal(true);
  readonly reminder = signal(true);
  private readonly loading = inject(LoadingService);
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
    this.editing.set(true);
  }
  save(): void {
    this.profile.set({ ...this.draft });
    this.editing.set(false);
    this.notice.set('Đã cập nhật thông tin trong phiên này.');
  }
  changeAvatar(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/') || file.size > 5 * 1024 * 1024) {
      this.notice.set('Vui lòng chọn ảnh nhỏ hơn 5 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => this.avatar.set(String(reader.result));
    reader.readAsDataURL(file);
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
      this.profile.set({
        name: profile.name,
        email: profile.email,
        phone: profile.phoneNumber,
        birthday: profile.birthday?.split('T')[0] ?? '',
        gender: profile.gender ?? '',
        region: profile.address,
      });
      this.draft = { ...this.profile() };
    } catch {
      this.notice.set('Không thể tải thông tin cá nhân. Vui lòng thử lại.');
    } finally {
      finish();
    }
  }
}
