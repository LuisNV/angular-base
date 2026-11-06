import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  afterNextRender,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import { VtoButton, VtoMenubarItem, VtoToast } from '@vietinbank/vietinone-ui';
import { NotifyService } from '../services/notify.service';
import { NAVIGATION } from './navigation';

// Keep in sync with the media queries in shell.scss
const MOBILE_QUERY = '(max-width: 767.98px)';
const COLLAPSED_SIDEBAR_QUERY = '(max-width: 1279.98px)';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, VtoButton, VtoToast],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(document:keydown.escape)': 'closeMenu()' },
})
export class Shell {
  private readonly router = inject(Router);
  private readonly notify = inject(NotifyService);
  private readonly breakpoints = inject(BreakpointObserver);

  protected readonly groups = NAVIGATION;
  protected readonly unreadCount = signal(0);
  protected readonly searchQuery = signal('');

  protected openSearchResult(): void {
    this.searchQuery.set('');
    this.router.navigate(['/home']);
  }

  // Mobile shows the menu as a drawer; larger screens dock it and can collapse it to icons
  protected readonly isMobile = signal(this.breakpoints.isMatched(MOBILE_QUERY));
  protected readonly sidebarCollapsed = signal(this.breakpoints.isMatched(COLLAPSED_SIDEBAR_QUERY));
  protected readonly menuOpen = signal(false);

  protected readonly isCollapsed = computed(() => !this.isMobile() && this.sidebarCollapsed());

  // The toggle shows what the next click does: open the menu, or collapse the expanded sidebar
  private readonly canOpenMenu = computed(() => this.isMobile() || this.sidebarCollapsed());
  protected readonly toggleSymbol = computed(() => (this.canOpenMenu() ? 'menu' : 'menu_open'));
  protected readonly toggleLabel = computed(() =>
    this.canOpenMenu() ? 'Mở menu' : 'Thu gọn menu',
  );

  private readonly toast = viewChild.required(VtoToast);

  private readonly url = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.router.url),
    ),
    { initialValue: this.router.url },
  );

  protected readonly activeId = computed(() => this.url().split(/[/?#]/)[1] ?? '');

  constructor() {
    afterNextRender(() => this.notify.register(this.toast()));
    inject(DestroyRef).onDestroy(() => this.notify.register(undefined));

    // Leaving mobile must not leave an invisible drawer open behind the docked sidebar
    this.breakpoints
      .observe(MOBILE_QUERY)
      .pipe(takeUntilDestroyed())
      .subscribe(({ matches }) => {
        this.isMobile.set(matches);
        if (!matches) {
          this.menuOpen.set(false);
        }
      });

    // Auto-collapse when the window crosses 1280px; the user can still toggle in between
    this.breakpoints
      .observe(COLLAPSED_SIDEBAR_QUERY)
      .pipe(takeUntilDestroyed())
      .subscribe(({ matches }) => this.sidebarCollapsed.set(matches));
  }

  // Drawer on mobile, icon-only sidebar on larger screens
  protected toggleMenu(): void {
    if (this.isMobile()) {
      this.menuOpen.update((open) => !open);
      return;
    }
    this.sidebarCollapsed.update((collapsed) => !collapsed);
  }

  // Also bound to Escape and the backdrop
  protected closeMenu(): void {
    this.menuOpen.set(false);
  }

  // Close the drawer first so the chosen page is not hidden behind it
  protected navigate(item: VtoMenubarItem): void {
    this.closeMenu();
    this.router.navigate(['/', item.id]);
  }
}
