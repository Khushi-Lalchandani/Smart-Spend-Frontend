'use client';
import React, { useEffect, useState } from 'react';
import { useGetTransactions, useDeleteTransaction } from '@/src/shared/hooks';
import { ITransaction, IQueryTransactionRequest } from '@/src/utils/types';
import TransactionFormModal from './components/TransactionFormModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { apiRoutes } from '@/src/shared/hooks/routes';

export default function TransactionsPage() {
  const queryClient = useQueryClient();
  const [queryParams, setQueryParams] = useState<IQueryTransactionRequest>({
    page: 1,
    limit: 20,
    sortBy: 'date',
    sortOrder: 'desc',
    type: undefined,
    q: '',
  });
  const [searchInput, setSearchInput] = useState('');

  // 350ms Debounced search effect
  useEffect(() => {
    const handler = setTimeout(() => {
      setQueryParams((prev) => ({ ...prev, q: searchInput, page: 1 }));
    }, 350);

    return () => clearTimeout(handler);
  }, [searchInput]);

  const { data, isLoading, isError } = useGetTransactions(queryParams);
  const transactions = data?.data || [];
  const meta = data?.meta;

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<ITransaction | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { mutate: deleteTx, isPending: isDeleting } = useDeleteTransaction(deletingId || '');

  const formatINR = (amount: number | string) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(amount));
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setQueryParams((prev) => ({ ...prev, q: '', page: 1 }));
  };

  const handleTypeFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setQueryParams((prev) => ({
      ...prev,
      type: value === '' ? undefined : (value as 'INCOME' | 'EXPENSE'),
      page: 1,
    }));
  };

  const openAdd = () => {
    setEditingTransaction(null);
    setIsFormOpen(true);
  };

  const openEdit = (t: ITransaction) => {
    setEditingTransaction(t);
    setIsFormOpen(true);
  };

  const openDelete = (id: string) => {
    setDeletingId(id);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (!deletingId) return;
    deleteTx(undefined, {
      onSuccess: () => {
        toast.success('Transaction deleted');
        queryClient.invalidateQueries({ queryKey: [apiRoutes.transactions.GET.query] });
        setIsDeleteOpen(false);
        setDeletingId(null);
      },
      onError: () => {
        toast.error('Failed to delete transaction');
      },
    });
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header Bar */}
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Transactions</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            View, search, filter, and manage your financial records.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
        >
          + Add Transaction
        </button>
      </div>

      {/* Filters & Search Card */}
      <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between dark:border-slate-800 dark:bg-slate-900">
        <div className="relative flex flex-1 items-center max-w-md">
          <svg className="absolute left-3.5 h-4 w-4 fill-slate-400 dark:fill-slate-500 pointer-events-none" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search description or notes..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-9 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 dark:focus:border-indigo-400"
          />
          {searchInput && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              title="Clear search"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Type:</label>
          <select
            value={queryParams.type || ''}
            onChange={handleTypeFilter}
            className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-400"
          >
            <option value="">All Types</option>
            <option value="EXPENSE">Expense</option>
            <option value="INCOME">Income</option>
          </select>
        </div>
      </div>

      {/* Transactions Table Card */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {isLoading ? (
          <div className="py-12 text-center text-sm text-slate-500 dark:text-slate-400">
            Loading transactions...
          </div>
        ) : isError ? (
          <div className="py-12 text-center text-sm text-red-500">
            Failed to load transactions. Please try again.
          </div>
        ) : transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 mb-3">
              <svg className="h-6 w-6 fill-current" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 3a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H7z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">No transactions found</p>
            <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">Try clearing filters or add a new transaction.</p>
            <button
              onClick={openAdd}
              className="mt-4 text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
            >
              + Add Transaction
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
              <thead className="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {transactions.map((t) => (
                  <tr key={t.id} className="transition hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                    <td className="whitespace-nowrap px-6 py-4 text-slate-500 dark:text-slate-400">
                      {new Date(t.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900 dark:text-white">{t.description}</div>
                      {t.notes && <div className="text-xs text-slate-400 dark:text-slate-500">{t.notes}</div>}
                    </td>
                    <td className="px-6 py-4">
                      {t.category ? (
                        <span className="inline-block rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          {t.category}
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`font-bold ${
                          t.type === 'INCOME'
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {t.type === 'INCOME' ? '+' : '-'}{formatINR(t.amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => openEdit(t)}
                        className="mr-3 font-semibold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openDelete(t.id)}
                        className="font-semibold text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination Footer */}
      {meta && meta.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between border-t border-slate-200/60 pt-4 dark:border-slate-800">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Page <strong className="text-slate-900 dark:text-white">{meta.page}</strong> of <strong className="text-slate-900 dark:text-white">{meta.totalPages}</strong>
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setQueryParams((p) => ({ ...p, page: (p.page || 1) - 1 }))}
              disabled={(queryParams.page || 1) <= 1}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-40 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Previous
            </button>
            <button
              onClick={() => setQueryParams((p) => ({ ...p, page: (p.page || 1) + 1 }))}
              disabled={(queryParams.page || 1) >= meta.totalPages}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-40 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Form and Confirmation Modals */}
      <TransactionFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        transaction={editingTransaction}
      />
      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
      />
    </main>
  );
}
