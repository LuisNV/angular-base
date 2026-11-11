import { describe, expect, it, vi } from 'vitest';
import { LoginUseCase } from './login.use-case';

describe('LoginUseCase', () => {
  it('rejects empty credentials without calling the repository', async () => {
    const repository = { login: vi.fn(), logout: vi.fn() };
    const useCase = new LoginUseCase(repository);
    await expect(useCase.execute({ identifier: '  ', password: 'secret' })).rejects.toThrow();
    await expect(useCase.execute({ identifier: 'user', password: '' })).rejects.toThrow();
    expect(repository.login).not.toHaveBeenCalled();
  });

  it('normalizes identifier and preserves password whitespace', async () => {
    const session = { accessToken: 'test-token', refreshToken: 'test-refresh-token' };
    const repository = { login: vi.fn().mockResolvedValue(session), logout: vi.fn() };
    const useCase = new LoginUseCase(repository);
    await expect(useCase.execute({ identifier: ' user ', password: ' secret ' })).resolves.toEqual(
      session,
    );
    expect(repository.login).toHaveBeenCalledWith({ identifier: 'user', password: ' secret ' });
  });

  it('propagates login failures to the caller', async () => {
    const failure = new Error('Login failed');
    const repository = { login: vi.fn().mockRejectedValue(failure), logout: vi.fn() };
    await expect(
      new LoginUseCase(repository).execute({ identifier: 'user', password: 'secret' }),
    ).rejects.toBe(failure);
  });
});
