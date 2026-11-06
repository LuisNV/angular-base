import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingOverlay } from './core/components/loading-overlay/loading-overlay';
import { LoadingService } from './core/services/loading.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoadingOverlay],
  template:
    '<div [inert]="loading.isLoading()" [attr.aria-busy]="loading.isLoading()"><router-outlet /></div><app-loading-overlay />',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly loading = inject(LoadingService);
}
