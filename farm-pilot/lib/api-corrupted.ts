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
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('fm_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

import { authEvents } from './authEvents';

async function tryRefreshToken() {
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
    // refresh failed - clear tokens and emit logout so app can react
    logout();
    return res;
  }
  return res;
}

async function handleResponse(res: Response) {
  if (res.ok) return res.json().catch(() => ({}));
  const body = await res.json().catch(() => ({}));
  const bodyObj = body as Record<string, unknown>;
  const message = typeof bodyObj?.message === 'string' ? bodyObj.message : res.statusText;
  const err = new Error(message);
  (err as unknown as { status?: number }).status = res.status;
  throw err;
}

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
  const query = new URLSearchParams(filters).toString();
  const res = await fetchWithAuth(`${BASE}/api/daily-logs?${query}`);
  return handleResponse(res);
}

export async function createDailyLog(data: Record<string, unknown>) {
  const res = await fetchWithAuth(`${BASE}/api/daily-logs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function updateDailyLog(id: string, data: Record<string, unknown>) {
  const res = await fetchWithAuth(`${BASE}/api/daily-logs/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function deleteDailyLog(id: string) {
  const res = await fetchWithAuth(`${BASE}/api/daily-logs/${id}`, {
    method: 'DELETE',
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
    houseName: payload.name,
    capacity: payload.capacity,
    currentBirdCount: payload.currentBirds,
    location: payload.location,
    status: payload.status,
    description: payload.notes,
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
  if (payload.name !== undefined) body.houseName = payload.name;
  if (payload.capacity !== undefined) body.capacity = payload.capacity;
  if (payload.currentBirds !== undefined) body.currentBirdCount = payload.currentBirds;
  if (payload.location !== undefined) body.location = payload.location;
  if (payload.dateBuilt !== undefined) body.dateBuilt = payload.dateBuilt;
  if (payload.notes !== undefined) body.description = payload.notes;

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
    headers: {},
  });

  if (res.status === 204) return true;
  const data = await handleResponse(res);
  return !!data;
}

export async function login(username: string, password: string) {
  const res = await fetch(`${BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  const data = await handleResponse(res);
  // store token(s) for subsequent requests
  try {
    if (typeof window !== 'undefined' && data?.token) {
      localStorage.setItem('fm_token', data.token);
      if (data.refreshToken) localStorage.setItem('fm_refresh', data.refreshToken);
      try {
        console.log('[api] login stored tokens');
      } catch {}
      authEvents.emit('login');
    }
  } catch {
    // ignore storage errors
  }

  return data;
}

export function logout() {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('fm_token');
      localStorage.removeItem('fm_refresh');
      // emit logout so subscribers can react
      authEvents.emit('logout');
    }
  } catch {
    // ignore
  }
}

export async function getCurrentUser() {
  try {
    const res = await fetchWithAuth(`${BASE}/api/auth/me`);
    const data = await handleResponse(res);
    return data?.data || null;
  } catch (error) {
    if (error && typeof error === 'object' && 'status' in error && error.status === 401) {
      return null;
    }
    throw error;
  }
}

// --- Feed API wrappers ---
export async function createFeedRecipe(payload: Record<string, unknown>) {
  const res = await fetchWithAuth(`${BASE}/api/feed/recipes`, {
    method: 'POST',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(payload),
  });
  const data = await handleResponse(res);
  return data?.data || null;
}

export async function getFeedRecipes() {
  const res = await fetchWithAuth(`${BASE}/api/feed/recipes`);
  const data = await handleResponse(res);
  return data?.data || [];
}

export async function createFeedBatch(payload: Record<string, unknown>) {
  const res = await fetchWithAuth(`${BASE}/api/feed/batches`, {
    method: 'POST',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(payload),
  });
  const data = await handleResponse(res);
  return data?.data || null;
}

export async function getFeedBatches() {
  const res = await fetchWithAuth(`${BASE}/api/feed/batches`);
  const data = await handleResponse(res);
  return data?.data || [];
}

// --- Costs API wrappers ---
export async function getDailyCost(date: string) {
  const res = await fetchWithAuth(`${BASE}/api/costs/daily/${encodeURIComponent(date)}`);
  const data = await handleResponse(res);
  return data?.data || null;
}

export async function getCostSummary(start: string, end: string) {
  const res = await fetchWithAuth(
    `${BASE}/api/costs/summary?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`
  );
  const data = await handleResponse(res);
  return data?.data || null;
}

export async function createOperatingCost(payload: Record<string, unknown>) {
  const res = await fetchWithAuth(`${BASE}/api/costs/operating`, {
    method: 'POST',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(payload),
  });
  const data = await handleResponse(res);
  return data?.data || null;
}

// --- Sales API wrappers ---
export async function getSales(query: Record<string, string> = {}) {
  const qs = new URLSearchParams(query).toString();
  const res = await fetchWithAuth(`${BASE}/api/sales${qs ? `?${qs}` : ''}`);
  const data = await handleResponse(res);
  return data?.data || [];
}

export async function createSale(payload: Record<string, unknown>) {
  const res = await fetchWithAuth(`${BASE}/api/sales`, {
    method: 'POST',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(payload),
  });
  const data = await handleResponse(res);
  return data?.data || null;
}

export async function updateSale(id: string, payload: Record<string, unknown>) {
  const res = await fetchWithAuth(`${BASE}/api/sales/${id}`, {
    method: 'PUT',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(payload),
  });
  const data = await handleResponse(res);
  return data?.data || null;
}

// --- Customers API wrappers ---
export async function getCustomers() {
  const res = await fetchWithAuth(`${BASE}/api/customers`);
  const data = await handleResponse(res);
  return data?.data || [];
}

export async function createCustomer(payload: Record<string, unknown>) {
  const res = await fetchWithAuth(`${BASE}/api/customers`, {
    method: 'POST',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(payload),
  });
  const data = await handleResponse(res);
  return data?.data || null;
}

export async function updateCustomer(id: string, payload: Record<string, unknown>) {
  const res = await fetchWithAuth(`${BASE}/api/customers/${id}`, {
    method: 'PUT',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(payload),
  });
  const data = await handleResponse(res);
  return data?.data || null;
}

// --- Reports wrappers ---
export async function getProductionReport(params: Record<string, string>) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetchWithAuth(`${BASE}/api/reports/production?${qs}`);
  const data = await handleResponse(res);
  return data?.data || null;
}

export async function getSalesReport(params: Record<string, string>) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetchWithAuth(`${BASE}/api/reports/sales?${qs}`);
  const data = await handleResponse(res);
  return data?.data || null;
}

export async function getFinancialReport(params: Record<string, string>) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetchWithAuth(`${BASE}/api/reports/financial?${qs}`);
  const data = await handleResponse(res);
  return data?.data || null;
}

// --- Staff API wrappers (owner-only) ---
export async function listStaff() {
  const res = await fetchWithAuth(`${BASE}/api/staff`);
  const data = await handleResponse(res);
  return data?.data || [];
}

export async function createStaff(payload: {
  username: string;
  password: string;
  fullName: string;
}) {
  const res = await fetchWithAuth(`${BASE}/api/staff`, {
    method: 'POST',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(payload),
  });
  const data = await handleResponse(res);
  return data?.data || null;
}

export async function updateStaff(id: string, payload: { fullName?: string }) {
  const res = await fetchWithAuth(`${BASE}/api/staff/${id}`, {
    method: 'PUT',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(payload),
  });
  const data = await handleResponse(res);
  return data?.data || null;
}

export async function deleteStaff(id: string) {
  const res = await fetchWithAuth(`${BASE}/api/staff/${id}`, {
    method: 'DELETE',
  });
  if (res.status === 204) return true;
  const data = await handleResponse(res);
  return !!data;
}

// --- Labor API wrappers ---
export async function getLaborers() {
  const res = await fetchWithAuth(`${BASE}/api/labor/laborers`);
  const data = await handleResponse(res);
  return data?.data || [];
}

export async function createLaborer(payload: Record<string, unknown>) {
  const res = await fetchWithAuth(`${BASE}/api/labor/laborers`, {
    method: 'POST',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(payload),
  });
  const data = await handleResponse(res);
  return data?.data || null;
}

export async function updateLaborer(id: string, payload: Record<string, unknown>) {
  const res = await fetchWithAuth(`${BASE}/api/labor/laborers/${id}`, {
    method: 'PUT',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(payload),
  });
  const data = await handleResponse(res);
  return data?.data || null;
}

export async function deleteLaborer(id: string) {
  const res = await fetchWithAuth(`${BASE}/api/labor/laborers/${id}`, {
    method: 'DELETE',
  });
  if (res.status === 204) return true;
  const data = await handleResponse(res);
  return !!data;
}

// Work assignments
export async function getWorkAssignments() {
  const res = await fetchWithAuth(`${BASE}/api/labor/work-assignments`);
  const data = await handleResponse(res);
  return data?.data || [];
}

export async function createWorkAssignment(payload: Record<string, unknown>) {
  const res = await fetchWithAuth(`${BASE}/api/labor/work-assignments`, {
    method: 'POST',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(payload),
  });
  const data = await handleResponse(res);
  return data?.data || null;
}

export async function updateWorkAssignment(id: string, payload: Record<string, unknown>) {
  const res = await fetchWithAuth(`${BASE}/api/labor/work-assignments/${id}`, {
    method: 'PUT',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(payload),
  });
  const data = await handleResponse(res);
  return data?.data || null;
}

// Payroll
export async function getPayrollMonth(monthYear: string) {
  const res = await fetchWithAuth(`${BASE}/api/labor/payroll/${encodeURIComponent(monthYear)}`);
  const data = await handleResponse(res);
  return data?.data || null;
}

export async function generatePayroll(monthYear: string, payload: Record<string, unknown>) {
  const res = await fetchWithAuth(
    `${BASE}/api/labor/payroll/generate/${encodeURIComponent(monthYear)}`,
    {
      method: 'POST',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(payload),
    }
  );
  const data = await handleResponse(res);
  return data?.data || null;
}

export async function updatePayroll(id: string, payload: Record<string, unknown>) {
  const res = await fetchWithAuth(`${BASE}/api/labor/payroll/${id}`, {
    method: 'PUT',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(payload),
  });
  const data = await handleResponse(res);
  return data?.data || null;
}

export async function getPayrollSummary() {
  const res = await fetchWithAuth(`${BASE}/api/labor/payroll/summary`);
  const data = await handleResponse(res);
  return data?.data || null;
}
