export type Role = 'employee' | 'manager' | 'director' | 'executive';
export type Category = 'general' | 'travel' | 'meeting' | 'entertainment';
export type Status = 'pending' | 'approved' | 'rejected';

export interface User {
  id: string;
  name: string;
  role: Role;
  roleDisplayName: string;
}

export interface Expense {
  id: string;
  userId: string;
  amount: number;
  category: Category;
  description: string;
  status: Status;
  approverId: string | null;
  approvedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExpenseRequest {
  userId: string;
  amount: number;
  category: Category;
  description: string;
}

export interface ApproveRejectRequest {
  approverId: string;
}
