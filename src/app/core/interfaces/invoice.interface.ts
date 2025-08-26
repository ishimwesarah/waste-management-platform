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