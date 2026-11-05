import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../../core/services/auth.service';
import { LoginUseCase } from '../../../domain/use-cases/login.use-case';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  private readonly login = inject(LoginUseCase);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly showPassword = signal(false);
  protected readonly rememberMe = signal(false);
  protected readonly showHelp = signal(false);

  protected readonly loading = signal(false);
  protected readonly error = signal('');
  protected readonly success = signal(false);

  protected async submit(identifier: string, password: string): Promise<void> {
    if (this.loading()) return;
    this.loading.set(true);
    this.error.set('');
    this.success.set(false);
    try {
      const session = await this.login.execute({ identifier, password });
      this.auth.setSession(session);
      this.success.set(true);
      const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
      await this.router.navigateByUrl(returnUrl || '/home');
    } catch {
      this.error.set('Đăng nhập thất bại. Vui lòng kiểm tra thông tin và thử lại.');
    } finally {
      this.loading.set(false);
    }
  }
}
