import { ICommonResponse } from './commonTypes';

export interface ITransaction {
  id: string;
  userId: string;
  amount: number | string; // amount is Prisma Decimal, serialized as string or number
  type: 'INCOME' | 'EXPENSE';
  date: string;
  description: string;
  category?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface ICreateTransactionRequest {
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  date: string;
  description: string;
  category?: string;
  notes?: string;
}

export type IUpdateTransactionRequest = Partial<ICreateTransactionRequest>;

export interface IQueryTransactionRequest {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  type?: 'INCOME' | 'EXPENSE';
  category?: string;
  q?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ITransactionListResponse extends ICommonResponse {
  data: ITransaction[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ITransactionResponse extends ICommonResponse {
  data: ITransaction;
}
