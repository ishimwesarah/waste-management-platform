export interface ScheduleEntry {
  id: string;
  area: string;
  collectionDate: string; // YYYY-MM-DD
  collectionTime: string; // HH:MM
  status: 'scheduled' | 'collected' | 'rescheduled' | 'cancelled';
  collectorId?: string;
}