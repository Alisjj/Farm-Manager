// Lightweight API client for the frontend to talk to the backend
// Uses NEXT_PUBLIC_API_URL or falls back to http://localhost:5001

type BackendHouse = {
  id: string;
  houseName?: string;
  name?: string;
  capacity?: number | string;
  currentBirdCount?: number | string;
  location?: string;
  createdAt?: string;
  description?: string;
  status?: string;
};

type FrontendHousePayload = {
  name?: string;
  capacity?: number;
  currentBirds?: number;
  location?: string;
  status?: string;
  notes?: string;
};

interface House {
  id: string;
  name: string;
  capacity: number;
  currentBirds: number;
  location: string;
  status: 'active' | 'maintenance' | 'inactive';
  notes?: string;
}

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

function authHeader(): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem('fm_token') : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function tryRefreshToken(): Promise<boolean> {
  try {
    if (typeof window === 'undefined') return false;
    try {
      console.log('[api] tryRefreshToken start');
    } catch {}
    const refresh = localStorage.getItem('fm_refresh');
    try {
      console.log('[api] fm_refresh present?', !!refresh);
    } catch {}
    if (!refresh) return false;
    const res = await fetch(`${BASE}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: refresh }),
    });
    if (!res.ok) return false;
    const body = await res.json().catch(() => ({}));
    const token = body?.token || body?.data?.token;
    if (token) {
      localStorage.setItem('fm_token', token);
      try {
        console.log('[api] tryRefreshToken stored new token');
      } catch {}
      authEvents.emit('refresh');
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

async function fetchWithAuth(input: RequestInfo | URL, init?: RequestInit, retry = true) {
  // Normalize headers and attach Authorization header without unsafe casts
  const headers = new Headers(init?.headers as HeadersInit | undefined);
  const ah = authHeader();
  Object.entries(ah).forEach(([k, v]) => {
    if (v !== undefined && v !== null) headers.set(k, String(v));
  });
  const merged: RequestInit = { ...(init || {}), headers };
  const res = await fetch(input, merged);
  if (res.status === 401 && retry) {
    const refreshed = await tryRefreshToken();
    if (refreshed) {
      const headers2 = new Headers(init?.headers as HeadersInit | undefined);
      const ah2 = authHeader();
      Object.entries(ah2).forEach(([k, v]) => {
        if (v !== undefined && v !== null) headers2.set(k, String(v));
      });
      const retried: RequestInit = { ...(init || {}), headers: headers2 };
      return fetch(input, retried);
    }
  }
  return res;
}

async function handleResponse(res: Response) {
  if (!res.ok) {
    const err = new Error(`HTTP ${res.status}`);
    try {
      const body = await res.json();
      err.message = body?.message || err.message;
    } catch {}
    throw err;
  }
  return res.json().catch(() => ({}));
}

// Event emitter for auth events
class EventEmitter {
  private events: Record<string, Function[]> = {};

  emit(event: string, ...args: any[]) {
    (this.events[event] || []).forEach((fn) => fn(...args));
  }

  on(event: string, fn: Function) {
    this.events[event] = this.events[event] || [];
    this.events[event].push(fn);
  }

  off(event: string, fn: Function) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter((f) => f !== fn);
  }
}

export const authEvents = new EventEmitter();

function mapBackendHouse(house: BackendHouse): House {
  return {
    id: house.id,
    name: house.houseName || house.name || 'Unknown',
    capacity: Number(house.capacity) || 0,
    currentBirds: Number(house.currentBirdCount) || 0,
    location: house.location || 'N/A',
    status:
      house.status === 'active' || house.status === 'maintenance' || house.status === 'inactive'
        ? house.status
        : 'inactive',
    notes: house.description,
  };
}

// Daily Logs
export async function getDailyLogs(filters: Record<string, string> = {}) {
  const params = new URLSearchParams(filters);
  const res = await fetchWithAuth(`${BASE}/api/daily-logs?${params}`);
  const data = await handleResponse(res);
  return data;
}

export async function createDailyLog(payload: any) {
  const res = await fetchWithAuth(`${BASE}/api/daily-logs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

// Houses
export async function getHouses() {
  const res = await fetchWithAuth(`${BASE}/api/houses`);
  const data = await handleResponse(res);
  return (data?.data || []).map(mapBackendHouse);
}

export async function createHouse(payload: FrontendHousePayload) {
  // map frontend shape -> backend expected fields
  const body = {
    name: payload.name,
    capacity: payload.capacity,
    currentBirds: payload.currentBirds,
    location: payload.location,
    status: payload.status,
    notes: payload.notes,
  };

  const res = await fetchWithAuth(`${BASE}/api/houses`, {
    method: 'POST',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(body),
  });

  const data = await handleResponse(res);
  return mapBackendHouse(data?.data);
}

export async function updateHouse(id: string, payload: FrontendHousePayload) {
  const body: Record<string, unknown> = {};
  if (payload.name !== undefined) body.name = payload.name;
  if (payload.capacity !== undefined) body.capacity = payload.capacity;
  if (payload.currentBirds !== undefined) body.currentBirds = payload.currentBirds;
  if (payload.location !== undefined) body.location = payload.location;
  if (payload.status !== undefined) body.status = payload.status;
  if (payload.notes !== undefined) body.notes = payload.notes;

  const res = await fetchWithAuth(`${BASE}/api/houses/${id}`, {
    method: 'PUT',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(body),
  });

  const data = await handleResponse(res);
  return mapBackendHouse(data?.data);
}

export async function deleteHouse(id: string) {
  const res = await fetchWithAuth(`${BASE}/api/houses/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(res);
}

// Auth
export async function login(credentials: { username: string; password: string }) {
  const res = await fetch(`${BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  const data = await handleResponse(res);
  if (data?.token) {
    localStorage.setItem('fm_token', data.token);
    if (data.refreshToken) {
      localStorage.setItem('fm_refresh', data.refreshToken);
    }
    authEvents.emit('login');
  }
  return data;
}

export async function logout() {
  const refresh = localStorage.getItem('fm_refresh');
  if (refresh) {
    try {
      await fetch(`${BASE}/api/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: refresh }),
      });
    } catch {}
  }
  localStorage.removeItem('fm_token');
  localStorage.removeItem('fm_refresh');
  authEvents.emit('logout');
}

export async function getCurrentUser() {
  try {
    const res = await fetchWithAuth(`${BASE}/api/auth/me`);
    if (res.status === 401) {
      return null; // Let the caller handle auth errors gracefully
    }
    const data = await handleResponse(res);
    return data?.user || data?.data || null;
  } catch (error: any) {
    if (error.message?.includes('401')) {
      return null; // Return null for 401 errors instead of throwing
    }
    throw error;
  }
}

// Staff
export async function listStaff() {
  const res = await fetchWithAuth(`${BASE}/api/staff`);
  return handleResponse(res);
}

// Laborers
export async function getLaborers() {
  const res = await fetchWithAuth(`${BASE}/api/labor`);
  return handleResponse(res);
}

// Sales
export async function getSales(filters: Record<string, string> = {}) {
  const params = new URLSearchParams(filters);
  const res = await fetchWithAuth(`${BASE}/api/sales?${params}`);
  return handleResponse(res);
}

export async function createSale(payload: any) {
  const res = await fetchWithAuth(`${BASE}/api/sales`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

// Customers
export async function getCustomers() {
  const res = await fetchWithAuth(`${BASE}/api/customers`);
  return handleResponse(res);
}

export async function createCustomer(payload: any) {
  const res = await fetchWithAuth(`${BASE}/api/customers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

// Reports
export async function getReports(type: string, filters: Record<string, string> = {}) {
  const params = new URLSearchParams(filters);
  const res = await fetchWithAuth(`${BASE}/api/reports/${type}?${params}`);
  return handleResponse(res);
}

// Feed Management
export async function getFeedRecipes() {
  const res = await fetchWithAuth(`${BASE}/api/feed/recipes`);
  return handleResponse(res);
}

export async function createFeedRecipe(payload: any) {
  const res = await fetchWithAuth(`${BASE}/api/feed/recipes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function updateFeedRecipe(id: string, payload: any) {
  const res = await fetchWithAuth(`${BASE}/api/feed/recipes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function deleteFeedRecipe(id: string) {
  const res = await fetchWithAuth(`${BASE}/api/feed/recipes/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(res);
}

export async function getFeedBatches(filters: Record<string, string> = {}) {
  const params = new URLSearchParams(filters);
  const res = await fetchWithAuth(`${BASE}/api/feed/batches?${params}`);
  return handleResponse(res);
}

export async function createFeedBatch(payload: any) {
  const res = await fetchWithAuth(`${BASE}/api/feed/batches`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function updateFeedBatch(id: string, payload: any) {
  const res = await fetchWithAuth(`${BASE}/api/feed/batches/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function deleteFeedBatch(id: string) {
  const res = await fetchWithAuth(`${BASE}/api/feed/batches/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(res);
}

export async function getBatchIngredients(batchId: string) {
  const res = await fetchWithAuth(`${BASE}/api/feed/batches/${batchId}/ingredients`);
  return handleResponse(res);
}

export async function addBatchIngredient(batchId: string, payload: any) {
  const res = await fetchWithAuth(`${BASE}/api/feed/batches/${batchId}/ingredients`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function estimateBatchCost(payload: any) {
  const res = await fetchWithAuth(`${BASE}/api/feed/batches/estimate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function calculateFeedBatchCost(payload: any) {
  const res = await fetchWithAuth(`${BASE}/api/feed/batches/calculate-cost`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}
