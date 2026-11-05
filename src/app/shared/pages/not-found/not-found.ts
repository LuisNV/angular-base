import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { VtoButton, VtoIcon } from '@vietinbank/vietinone-ui';

@Component({
  selector: 'app-not-found',
  imports: [VtoButton, VtoIcon],
  template: `
    <section class="card not-found">
      <vto-icon symbol="travel_explore" class="not-found__icon" />
      <h2>Không tìm thấy trang</h2>
      <p class="muted">Đường dẫn không tồn tại hoặc đã bị thay đổi.</p>
      <vto-button label="Về trang chủ" symbol="home" (clicked)="router.navigate(['/'])" />
    </section>
  `,
  styles: `
    .not-found {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      padding-block: 48px;
      text-align: center;
    }
    .not-found h2 {
      margin: 0;
    }
    .not-found__icon {
      font-size: 48px;
      color: var(--p-primary-color);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFound {
  protected readonly router = inject(Router);
}
