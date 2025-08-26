// src/app/core/interfaces/user.interface.ts (already defined, but important)
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'resident' | 'collector' | 'admin';
  address?: string;
  householdId?: string;
}

// src/app/core/interfaces/schedule.interface.ts
export interface ScheduleEntry {
  id: string;
  area: string;
  collectionDate: string; // YYYY-MM-DD
  collectionTime: string; // HH:MM
  status: 'scheduled' | 'collected' | 'rescheduled' | 'cancelled';
  collectorId?: string;
}

// src/app/core/interfaces/invoice.interface.ts
export interface Invoice {
  id: string;
  userId: string;
  issueDate: string; // YYYY-MM-DD
  dueDate: string;   // YYYY-MM-DD
  amount: number;
  status: 'pending' | 'paid' | 'overdue';
  services: string[];
  paymentDate?: string; // YYYY-MM-DD
}
export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginPayload {
  email: string;
  passwordHash: string;
}