/**
 * 経費申請API - 簡易デモサーバー
 * 既存システム
 */
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { CreateExpenseRequest, ApproveRejectRequest } from './types';
import { users, expenses, generateExpenseId } from './data';

const app = new Hono();
const PORT = 8080;

// CORS設定
app.use('*', cors());

// ルートエンドポイント
app.get('/', (c) => {
  return c.json({
    message: '経費申請API（既存システム）',
    version: '1.0.0',
    endpoints: {
      'GET /api/v1/users': 'ユーザー一覧取得',
      'GET /api/v1/users/:id': 'ユーザー詳細取得',
      'POST /api/v1/expenses': '経費申請作成',
      'GET /api/v1/expenses': '経費申請一覧取得',
      'GET /api/v1/expenses/:id': '経費申請詳細取得',
      'POST /api/v1/expenses/:id/approve': '承認',
      'POST /api/v1/expenses/:id/reject': '却下',
    }
  });
});

// ユーザー一覧取得
app.get('/api/v1/users', (c) => {
  console.log(`👥 ユーザー一覧取得`);
  return c.json(Object.values(users));
});

// ユーザー詳細取得
app.get('/api/v1/users/:id', (c) => {
  const id = c.req.param('id');
  const user = users[id];

  if (!user) {
    return c.json({ error: 'User not found' }, 404);
  }

  console.log(`👤 ユーザー詳細取得: ${user.name} (${user.role})`);
  return c.json(user);
});

// 経費申請作成
app.post('/api/v1/expenses', async (c) => {
  const body = await c.req.json<CreateExpenseRequest>();
  const { userId, amount, category, description } = body;

  const expense = {
    id: generateExpenseId(),
    userId,
    amount,
    category,
    description,
    status: 'pending' as const,
    approverId: null,
    approvedAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  expenses.push(expense);

  console.log(`✅ 経費申請作成: ${expense.id} (${amount}円)`);
  return c.json(expense, 201);
});

// 経費申請一覧取得
app.get('/api/v1/expenses', (c) => {
  console.log(`📋 経費申請一覧取得: ${expenses.length}件`);
  return c.json(expenses);
});

// 経費申請詳細取得
app.get('/api/v1/expenses/:id', (c) => {
  const id = c.req.param('id');
  const expense = expenses.find(e => e.id === id);

  if (!expense) {
    return c.json({ error: 'Expense not found' }, 404);
  }

  console.log(`📄 経費申請詳細取得: ${expense.id}`);
  return c.json(expense);
});

// 承認（既存実装）
app.post('/api/v1/expenses/:id/approve', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json<ApproveRejectRequest>();
  const { approverId } = body;

  const expense = expenses.find(e => e.id === id);

  if (!expense) {
    return c.json({ error: 'Expense not found' }, 404);
  }

  if (expense.status !== 'pending') {
    return c.json({ error: 'Expense is not pending' }, 400);
  }

  // 承認完了
  expense.status = 'approved';
  expense.approverId = approverId || 'manager-001';
  expense.approvedAt = new Date().toISOString();
  expense.updatedAt = new Date().toISOString();

  console.log(`✅ 承認完了: ${expense.id} (${expense.amount}円)`);
  return c.json(expense);
});

// 却下
app.post('/api/v1/expenses/:id/reject', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json<ApproveRejectRequest>();
  const { approverId } = body;

  const expense = expenses.find(e => e.id === id);

  if (!expense) {
    return c.json({ error: 'Expense not found' }, 404);
  }

  if (expense.status !== 'pending') {
    return c.json({ error: 'Expense is not pending' }, 400);
  }

  expense.status = 'rejected';
  expense.approverId = approverId || 'manager-001';
  expense.updatedAt = new Date().toISOString();

  console.log(`❌ 却下: ${expense.id} (${expense.amount}円)`);
  return c.json(expense);
});

// サーバー起動
serve({
  fetch: app.fetch,
  port: PORT,
}, (info) => {
  console.log('');
  console.log('========================================');
  console.log('  経費申請API（既存システム）');
  console.log('========================================');
  console.log('');
  console.log(`🚀 サーバー起動: http://localhost:${info.port}`);
  console.log('');
  console.log('利用可能なエンドポイント:');
  console.log('  POST   /api/v1/expenses          - 申請作成');
  console.log('  GET    /api/v1/expenses          - 一覧取得');
  console.log('  GET    /api/v1/expenses/:id      - 詳細取得');
  console.log('  POST   /api/v1/expenses/:id/approve - 承認');
  console.log('  POST   /api/v1/expenses/:id/reject  - 却下');
  console.log('');
  console.log('停止するには Ctrl+C を押してください');
  console.log('');
});
