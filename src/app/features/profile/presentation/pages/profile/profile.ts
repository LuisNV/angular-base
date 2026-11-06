import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoadingService } from '../../../../../core/services/loading.service';
import { ProfileUseCase } from '../../../domain/use-case/profile.use-case';

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
  profile = {
    name: 'Nguyễn Văn Thành',
    email: 'thanh.nguyen@example.com',
    phone: '090 123 4567',
    birthday: '1999-06-15',
    gender: 'Nam',
    region: 'Hà Nội',
  };
  draft = { ...this.profile };
  readonly tabs = [
    { id: 'personal', icon: 'person', label: 'Thông tin cá nhân' },
    { id: 'security', icon: 'lock', label: 'Bảo mật tài khoản' },
    { id: 'membership', icon: 'workspace_premium', label: 'Gói thành viên' },
    { id: 'notifications', icon: 'notifications', label: 'Thông báo' },
    { id: 'settings', icon: 'settings', label: 'Cài đặt' },
  ];
  edit(): void {
    this.draft = { ...this.profile };
    this.editing.set(true);
  }
  save(): void {
    this.profile = { ...this.draft };
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
    return this.profile.birthday.split('-').reverse().join('/');
  }
  async ngOnInit(): Promise<void> {
    const finish = this.loading.show();
    try {
      const profile = await this.profileUseCase.execute();
      this.profile = {
        name: profile.name,
        email: profile.email,
        phone: profile.phoneNumber,
        birthday: "22/02/1998",
        gender: 'Nam',
        region: profile.address,
      };
      this.draft = { ...this.profile };
    } catch {

    } finally {
      finish();
    }
  }
}
