// Lightweight API client for the frontend to talk to the backend
// Uses NEXT_PUBLIC_API_URL or falls back to http://localhost:5001

import {
  BackendHouse,
  FrontendHousePayload,
  House,
  HouseStatus,
  DailyLog,
  Sale,
  Customer,
  FeedRecipe,
  FeedBatch,
  Ingredient,
} from '@/types';
import { OperatingCost, CostEntry, CostFilters } from '@/types/entities/cost';

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

function authHeader(): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem('fm_token') : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function tryRefreshToken(): Promise<boolean> {
  try {
    if (typeof window === 'undefined') return false;

    const refresh = localStorage.getItem('fm_refresh');

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
      authEvents.emit('refresh');
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

async function fetchWithAuth(input: RequestInfo | URL, init?: RequestInit, retry = true) {
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
  private events: Record<string, ((...args: unknown[]) => void)[]> = {};

  emit(event: string, ...args: unknown[]) {
    (this.events[event] || []).forEach((fn) => fn(...args));
  }

  on(event: string, fn: (...args: unknown[]) => void) {
    this.events[event] = this.events[event] || [];
    this.events[event].push(fn);
  }

  off(event: string, fn: (...args: unknown[]) => void) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter((f) => f !== fn);
  }
}

export const authEvents = new EventEmitter();

function mapBackendHouse(house: BackendHouse): House {
  return {
    id: house.id,
    houseName: house.houseName || house.name || 'Unknown',
    capacity: Number(house.capacity) || 0,
    currentBirds: Number(house.currentBirdCount) || 0,
    location: house.location || 'N/A',
    status:
      house.status === HouseStatus.ACTIVE ||
      house.status === HouseStatus.MAINTENANCE ||
      house.status === HouseStatus.INACTIVE
        ? (house.status as HouseStatus)
        : HouseStatus.INACTIVE,
    notes: house.description,
  };
}

export async function getDailyLogs(filters: Record<string, string> = {}) {
  const params = new URLSearchParams(filters);
  const res = await fetchWithAuth(`${BASE}/api/daily-logs?${params}`);
  const data = await handleResponse(res);
  return data;
}

export async function createDailyLog(payload: Partial<DailyLog>) {
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
  const body = {
    houseName: payload.houseName,
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
  if (payload.houseName !== undefined) body.houseName = payload.houseName;
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
      return null;
    }
    const data = await handleResponse(res);
    return data?.user || data?.data || null;
  } catch (error: unknown) {
    if (error instanceof Error && error.message?.includes('401')) {
      return null;
    }
    throw error;
  }
}

export async function listStaff() {
  const res = await fetchWithAuth(`${BASE}/api/staff`);
  return handleResponse(res);
}

export async function createStaff(payload: { username: string; password: string }) {
  const res = await fetchWithAuth(`${BASE}/api/staff`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function updateStaff(
  id: number | string,
  payload: { fullName?: string; password?: string; isActive?: boolean }
) {
  const res = await fetchWithAuth(`${BASE}/api/staff/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function deleteStaff(id: number | string) {
  const res = await fetchWithAuth(`${BASE}/api/staff/${id}`, { method: 'DELETE' });
  return handleResponse(res);
}

// Labor API temporarily disabled
/*
export async function getLaborers() {
  const res = await fetchWithAuth(`${BASE}/api/labor`);
  return handleResponse(res);
}
*/

export async function getSales(filters: Record<string, string> = {}) {
  const params = new URLSearchParams(filters);
  const res = await fetchWithAuth(`${BASE}/api/sales?${params}`);
  return handleResponse(res);
}

export async function createSale(payload: Partial<Sale>) {
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

export async function createCustomer(payload: Partial<Customer>) {
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

export async function createFeedRecipe(payload: Partial<FeedRecipe>) {
  const res = await fetchWithAuth(`${BASE}/api/feed/recipes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function updateFeedRecipe(id: string, payload: Partial<FeedRecipe>) {
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

export async function createFeedBatch(payload: Partial<FeedBatch>) {
  const res = await fetchWithAuth(`${BASE}/api/feed/batches`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function updateFeedBatch(id: string, payload: Partial<FeedBatch>) {
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

export async function addBatchIngredient(batchId: string, payload: Partial<Ingredient>) {
  const res = await fetchWithAuth(`${BASE}/api/feed/batches/${batchId}/ingredients`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function estimateBatchCost(payload: { ingredients: Ingredient[] }) {
  const res = await fetchWithAuth(`${BASE}/api/feed/estimate-cost`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function calculateFeedBatchCost(payload: Partial<FeedBatch>) {
  const res = await fetchWithAuth(`${BASE}/api/feed/batches/calculate-cost`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function getFeedBatchUsageStats() {
  const res = await fetchWithAuth(`${BASE}/api/feed/batches-usage`);
  return handleResponse(res);
}

export async function getFeedBatchUsageById(id: string) {
  const res = await fetchWithAuth(`${BASE}/api/feed/batches/${id}/usage`);
  return handleResponse(res);
}

export async function getDailyCosts(date: string) {
  const res = await fetchWithAuth(`${BASE}/api/costs/daily/${date}`);
  return handleResponse(res);
}

export async function getCostsSummary(start: string, end: string) {
  const res = await fetchWithAuth(`${BASE}/api/costs/summary?start=${start}&end=${end}`);
  return handleResponse(res);
}

export async function createOperatingCost(payload: Partial<OperatingCost>) {
  const res = await fetchWithAuth(`${BASE}/api/costs/operating`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function getEggPriceEstimate(date: string) {
  const res = await fetchWithAuth(`${BASE}/api/costs/egg-price/${date}`);
  return handleResponse(res);
}

export async function getDailyCalculation(date: string) {
  const res = await fetchWithAuth(`${BASE}/api/costs/daily-calculation/${date}`);
  return handleResponse(res);
}

export async function getAverageMonthlyProduction(date: string) {
  const res = await fetchWithAuth(`${BASE}/api/costs/avg-production/${date}`);
  return handleResponse(res);
}

// New flexible cost entries API
export async function getCostTypes() {
  const res = await fetchWithAuth(`${BASE}/api/cost-entries/types`);
  return handleResponse(res);
}

export async function createCostEntry(payload: Partial<CostEntry>) {
  const res = await fetchWithAuth(`${BASE}/api/cost-entries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function getCostEntries(filters: CostFilters = {}, page = 1, limit = 50) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...Object.fromEntries(
      Object.entries(filters)
        .filter(([, value]) => value !== undefined)
        .map(([key, value]) => [key, String(value)])
    ),
  });

  const res = await fetchWithAuth(`${BASE}/api/cost-entries?${params}`);
  return handleResponse(res);
}

export async function getCostEntry(id: number) {
  const res = await fetchWithAuth(`${BASE}/api/cost-entries/${id}`);
  return handleResponse(res);
}

export async function updateCostEntry(id: number, payload: Partial<CostEntry>) {
  const res = await fetchWithAuth(`${BASE}/api/cost-entries/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function deleteCostEntry(id: number) {
  const res = await fetchWithAuth(`${BASE}/api/cost-entries/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(res);
}

export async function getCostEntriesSummary(filters: CostFilters = {}) {
  const params = new URLSearchParams(
    Object.fromEntries(
      Object.entries(filters)
        .filter(([, value]) => value !== undefined)
        .map(([key, value]) => [key, String(value)])
    )
  );

  const res = await fetchWithAuth(`${BASE}/api/cost-entries/summary?${params}`);
  return handleResponse(res);
}
