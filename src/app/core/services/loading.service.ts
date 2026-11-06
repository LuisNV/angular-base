import { computed, Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private readonly pending = signal(0);
  readonly isLoading = computed(() => this.pending() > 0);

  /** Returns an idempotent cleanup function; call it in finally/finalize. */
  show(): () => void {
    this.pending.update((count) => count + 1);
    let finished = false;
    return () => {
      if (finished) return;
      finished = true;
      this.pending.update((count) => count - 1);
    };
  }
}
