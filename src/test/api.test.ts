import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { api, ApiError, API_URL, SESSION_EXPIRED_EVENT, tokenStore } from '@/lib/api';

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

describe('cliente da API', () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    localStorage.clear();
    fetchMock.mockReset();
    vi.stubGlobal('fetch', fetchMock);
  });
  afterEach(() => vi.unstubAllGlobals());

  it('envia o token de acesso', async () => {
    tokenStore.set({ access_token: 'A1', refresh_token: 'R1' });
    fetchMock.mockResolvedValueOnce(json(200, { ok: true }));
    await api.get('/users/me');
    expect(fetchMock).toHaveBeenCalledWith(`${API_URL}/users/me`, expect.objectContaining({
      headers: expect.objectContaining({ Authorization: 'Bearer A1' }),
    }));
  });

  it('renova o token no 401 e repete a requisição', async () => {
    tokenStore.set({ access_token: 'velho', refresh_token: 'R1' });
    fetchMock
      .mockResolvedValueOnce(json(401, { detail: 'Token inválido ou expirado' }))
      .mockResolvedValueOnce(json(200, { access_token: 'novo', refresh_token: 'R2' }))
      .mockResolvedValueOnce(json(200, { id: 'u1' }));

    await expect(api.get('/users/me')).resolves.toEqual({ id: 'u1' });
    expect(fetchMock.mock.calls[1][0]).toBe(`${API_URL}/auth/refresh`);
    expect(fetchMock.mock.calls[2][1].headers.Authorization).toBe('Bearer novo');
    expect(tokenStore.refresh).toBe('R2');
  });

  it('desloga quando o refresh também falha', async () => {
    tokenStore.set({ access_token: 'velho', refresh_token: 'expirado' });
    const onExpired = vi.fn();
    window.addEventListener(SESSION_EXPIRED_EVENT, onExpired);
    fetchMock
      .mockResolvedValueOnce(json(401, { detail: 'Token inválido ou expirado' }))
      .mockResolvedValueOnce(json(401, { detail: 'Refresh token inválido' }));

    await expect(api.get('/users/me')).rejects.toBeInstanceOf(ApiError);
    expect(onExpired).toHaveBeenCalled();
    expect(tokenStore.access).toBeNull();
    window.removeEventListener(SESSION_EXPIRED_EVENT, onExpired);
  });

  it('traduz erros de validação do FastAPI em mensagem legível', async () => {
    fetchMock.mockResolvedValueOnce(json(422, {
      detail: [{ msg: 'Value error, Data de vencimento não pode ser no passado' }, { msg: 'Field required' }],
    }));
    await expect(api.post('/charges/', {})).rejects.toThrow('Data de vencimento não pode ser no passado; Field required');
  });

  it('avisa quando a API está fora do ar', async () => {
    fetchMock.mockRejectedValueOnce(new TypeError('Failed to fetch'));
    await expect(api.get('/users/me')).rejects.toThrow('Não foi possível conectar à API');
  });
});
