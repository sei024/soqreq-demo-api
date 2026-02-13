import type { User, Expense } from './types';

// ユーザーマスタ（役職付き）
export const users: Record<string, User> = {
  'user-001': {
    id: 'user-001',
    name: '田中太郎',
    role: 'employee',
    roleDisplayName: '一般社員'
  },
  'user-002': {
    id: 'user-002',
    name: '佐藤花子',
    role: 'employee',
    roleDisplayName: '一般社員'
  },
  'manager-001': {
    id: 'manager-001',
    name: '鈴木一郎',
    role: 'manager',
    roleDisplayName: '直属上司（課長）'
  },
  'director-001': {
    id: 'director-001',
    name: '山田次郎',
    role: 'director',
    roleDisplayName: '部長'
  },
  'executive-001': {
    id: 'executive-001',
    name: '高橋三郎',
    role: 'executive',
    roleDisplayName: '役員'
  },
};

// インメモリデータストア
export const expenses: Expense[] = [];
export let idCounter = 1;

export function generateExpenseId(): string {
  return `exp-${String(idCounter++).padStart(3, '0')}`;
}
