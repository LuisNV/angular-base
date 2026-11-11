import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Profile } from './profile';
import { ProfileUseCase } from '../../../domain/use-case/profile.use-case';
import { LogoutUseCase } from '../../../../auth/domain/use-cases/logout.use-case';
import { AuthService } from '../../../../../core/services/auth.service';
import { LoadingService } from '../../../../../core/services/loading.service';
import { NotifyService } from '../../../../../core/services/notify.service';

describe('Profile email updates', () => {
  let page: Profile;
  const update = vi.fn();
  const notify = { success: vi.fn(), error: vi.fn() };
  beforeEach(() => {
    vi.clearAllMocks();
    TestBed.configureTestingModule({ providers: [
      { provide: ProfileUseCase, useValue: { executeUpdateProfile: update } },
      { provide: LogoutUseCase, useValue: {} },
      { provide: AuthService, useValue: {} },
      { provide: LoadingService, useValue: {} },
      { provide: NotifyService, useValue: notify },
      { provide: Router, useValue: {} },
    ] });
    page = TestBed.runInInjectionContext(() => new Profile());
    page.profile.update(p => ({ ...p, email: 'old@example.com' }));
    page.edit();
    page.draft.email = 'new@example.com';
  });
  async function fail(code: number, status: number) {
    update.mockRejectedValue(new HttpErrorResponse({ status, error: { code } }));
    page.save();
    await vi.waitFor(() => expect(page.saving()).toBe(false));
  }
  it('opens password confirmation for 1001 and retains all edits', async () => {
    page.draft.name = 'New name';
    await fail(1001, 409);
    expect(page.emailPasswordOpen()).toBe(true);
    expect(page.draft.name).toBe('New name');
    expect(page.editing()).toBe(true);
    expect(notify.error).not.toHaveBeenCalled();
  });
  it('reports 1002 in the popup and clears the incorrect password', async () => {
    page.emailPasswordOpen.set(true);
    page.emailPassword = 'incorrect';
    await fail(1002, 400);
    expect(update).toHaveBeenCalledWith(expect.objectContaining({ currentPassword: 'incorrect' }));
    expect(page.emailPasswordOpen()).toBe(true);
    expect(page.passwordError()).toContain('Mật khẩu không đúng');
    expect(page.emailPassword).toBe('');
  });
  it('keeps 1003 on the editing form', async () => {
    page.emailPasswordOpen.set(true);
    page.emailPassword = 'correct';
    await fail(1003, 409);
    expect(page.emailPasswordOpen()).toBe(false);
    expect(page.emailError()).toContain('Email đã được sử dụng');
    expect(page.editing()).toBe(true);
    expect(page.draft.email).toBe('new@example.com');
  });
  it('omits unchanged email and saves the returned profile', async () => {
    page.draft.email = 'old@example.com';
    update.mockResolvedValue({ name: 'Saved', email: 'old@example.com' });
    page.save();
    await vi.waitFor(() => expect(page.saving()).toBe(false));
    expect(update.mock.calls[0][0]).not.toHaveProperty('email');
    expect(update.mock.calls[0][0]).not.toHaveProperty('currentPassword');
    expect(page.editing()).toBe(false);
    expect(notify.success).toHaveBeenCalled();
  });
});
