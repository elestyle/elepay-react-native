import { Log } from '@/utils/logger';

export async function requestJSON(
  url: string,
  secKey: string,
  method: 'GET' | 'POST' = 'POST',
  params?: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${secKey}`,
  };

  Log.i('Network', `>>> ${method} ${url}`, params);

  const start = Date.now();
  const response = await fetch(url, {
    method,
    headers,
    body: method !== 'GET' && params ? JSON.stringify(params) : undefined,
  });
  const elapsed = Date.now() - start;

  if (response.ok) {
    const json = await response.json();
    Log.i('Network', `<<< ${response.status} ${url} (${elapsed}ms)`, json);
    return json;
  }

  const body = await response.text();
  Log.e('Network', `<<< ${response.status} ${url} (${elapsed}ms)`, body);
  throw new Error(`Network request failed: ${response.status} ${body}`);
}
