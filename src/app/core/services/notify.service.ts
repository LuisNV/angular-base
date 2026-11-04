import { Injectable } from '@angular/core';
import type { VtoToast } from '@vietinbank/vietinone-ui';

@Injectable({ providedIn: 'root' })
export class NotifyService {
  private toast: VtoToast | undefined;

  register(toast: VtoToast | undefined): void {
    this.toast = toast;
  }

  info(summary: string, detail?: string): void {
    this.toast?.info(summary, detail);
  }

  success(summary: string, detail?: string): void {
    this.toast?.success(summary, detail);
  }

  warn(summary: string, detail?: string): void {
    this.toast?.warn(summary, detail);
  }

  error(summary: string, detail?: string): void {
    this.toast?.error(summary, detail);
  }
}
