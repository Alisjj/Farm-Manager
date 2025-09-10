import { UserRole } from '../enums';

export interface User {
  id: string;
  username: string;
  role: UserRole;
  email?: string;
}

export interface AuthCredentials {
  username: string;
  password: string;
}
