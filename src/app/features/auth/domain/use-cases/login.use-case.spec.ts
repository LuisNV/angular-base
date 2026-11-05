import { describe, expect, it, vi } from 'vitest';
import { LoginUseCase } from './login.use-case';

describe('LoginUseCase', () => {
  it('rejects empty credentials without calling the repository', async () => {
    const repository = { login: vi.fn() };
    const useCase = new LoginUseCase(repository);
    await expect(useCase.execute({ username: '  ', password: 'secret' })).rejects.toThrow();
    await expect(useCase.execute({ username: 'user', password: '' })).rejects.toThrow();
    expect(repository.login).not.toHaveBeenCalled();
  });

  it('normalizes username and preserves password whitespace', async () => {
    const session = { accessToken: 'test-token' };
    const repository = { login: vi.fn().mockResolvedValue(session) };
    const useCase = new LoginUseCase(repository);
    await expect(useCase.execute({ username: ' user ', password: ' secret ' })).resolves.toEqual(
      session,
    );
    expect(repository.login).toHaveBeenCalledWith({ username: 'user', password: ' secret ' });
  });

  it('propagates login failures to the caller', async () => {
    const failure = new Error('Login failed');
    const repository = { login: vi.fn().mockRejectedValue(failure) };
    await expect(
      new LoginUseCase(repository).execute({ username: 'user', password: 'secret' }),
    ).rejects.toBe(failure);
  });
});
