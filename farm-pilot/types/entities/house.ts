import { HouseStatus } from '../enums';

export interface BackendHouse {
  id: string;
  houseName?: string;
  name?: string;
  capacity?: number | string;
  currentBirdCount?: number | string;
  location?: string;
  createdAt?: string;
  description?: string;
  status?: string;
}

export interface House {
  id: string;
  houseName: string;
  capacity: number;
  currentBirds: number;
  location: string;
  status: HouseStatus;
  notes?: string;
}

export interface FrontendHousePayload {
  houseName?: string;
  capacity?: number;
  currentBirds?: number;
  location?: string;
  status?: string;
  notes?: string;
}
