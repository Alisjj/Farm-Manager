import { House } from './house';

export interface DailyLog {
  id: number | string;
  logDate: string;
  houseId: string;
  eggsTotal?: number;
  eggsCollected?: number;
  eggsGradeA?: number;
  eggsGradeB?: number;
  eggsGradeC?: number;
  feedConsumedKg?: number;
  mortalityCount?: number;
  notes?: string;
  House?: House;
}

export interface TodaySummary {
  totalEggs: number;
  housesLogged: number;
  totalHouses: number;
  houseBreakdown: Array<{
    houseId: number | string;
    houseName: string;
    eggs: number;
  }>;
}
