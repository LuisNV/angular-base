import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { VtoButton } from '@vietinbank/vietinone-ui';
import { NotifyService } from '../../core/services/notify.service';

@Component({
  selector: 'app-home',
  imports: [VtoButton],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  private readonly notify = inject(NotifyService);

  protected showNotification(): void {
    this.notify.success('Thành công', 'Base đã sẵn sàng để phát triển.');
  }
}
