const DEFAULT_API_URL = 'https://atlas-api-vkr4.onrender.com/atlas-api'

export const API_URL = String(import.meta.env?.VITE_API_URL || DEFAULT_API_URL).replace(/\/$/, '')
const SESSION_STORAGE_KEY = 'atlas.auth.token'

export function readStoredToken() {
  try { return localStorage.getItem(SESSION_STORAGE_KEY) || '' } catch { return '' }
}

export function storeToken(token) {
  try {
    if (token) localStorage.setItem(SESSION_STORAGE_KEY, token)
    else localStorage.removeItem(SESSION_STORAGE_KEY)
  } catch {}
}

export async function apiRequest(path, { token, method = 'GET', body } = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const payload = response.status === 204 ? null : await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(payload?.error || 'Não foi possível concluir a ação.')
  return payload
}

export async function apiBlob(path, token) {
  const response = await fetch(`${API_URL}${path}`, { headers: { Authorization: `Bearer ${token}` } })
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}))
    throw new Error(payload?.error || 'Não foi possível carregar o arquivo.')
  }
  return response.blob()
}

export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(new Error('Não foi possível ler o arquivo.'))
    reader.readAsDataURL(file)
  })
}
