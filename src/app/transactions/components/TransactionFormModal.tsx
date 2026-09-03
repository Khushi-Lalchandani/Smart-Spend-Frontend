'use client';
import React, { useEffect, useState } from 'react';
import { ITransaction, ICreateTransactionRequest } from '@/src/utils/types';
import { useCreateTransaction, useUpdateTransaction } from '@/src/shared/hooks';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { apiRoutes } from '@/src/shared/hooks/routes';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  transaction?: ITransaction | null;
}

const TransactionFormModal: React.FC<Props> = ({ isOpen, onClose, transaction }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<ICreateTransactionRequest>({
    amount: 0,
    type: 'EXPENSE',
    date: new Date().toISOString().split('T')[0],
    description: '',
    category: '',
    notes: '',
  });

  const { mutate: createTx, isPending: isCreating } = useCreateTransaction();
  const { mutate: updateTx, isPending: isUpdating } = useUpdateTransaction(transaction?.id || '');

  useEffect(() => {
    if (transaction) {
      setFormData({
        amount: Number(transaction.amount),
        type: transaction.type,
        date: transaction.date.split('T')[0],
        description: transaction.description,
        category: transaction.category || '',
        notes: transaction.notes || '',
      });
    } else {
      setFormData({
        amount: 0,
        type: 'EXPENSE',
        date: new Date().toISOString().split('T')[0],
        description: '',
        category: '',
        notes: '',
      });
    }
  }, [transaction, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'amount' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.amount <= 0) {
      toast.error('Amount must be greater than 0');
      return;
    }

    const payload = {
      ...formData,
      date: new Date(formData.date).toISOString(),
    };

    if (transaction) {
      updateTx(payload, {
        onSuccess: () => {
          toast.success('Transaction updated successfully');
          queryClient.invalidateQueries({ queryKey: [apiRoutes.transactions.GET.query] });
          onClose();
        },
      });
    } else {
      createTx(payload, {
        onSuccess: () => {
          toast.success('Transaction created successfully');
          queryClient.invalidateQueries({ queryKey: [apiRoutes.transactions.GET.query] });
          onClose();
        },
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl transition-all dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
          {transaction ? 'Edit Transaction' : 'Add New Transaction'}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-400"
            >
              <option value="EXPENSE">Expense</option>
              <option value="INCOME">Income</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Amount (₹)
            </label>
            <input
              type="number"
              name="amount"
              step="0.01"
              min="0.01"
              value={formData.amount || ''}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-400"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-400"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Description
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 dark:focus:border-indigo-400"
              required
              placeholder="e.g. Groceries"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Category (Optional)
            </label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 dark:focus:border-indigo-400"
              placeholder="e.g. Food"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Notes (Optional)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-400"
              rows={2}
            ></textarea>
          </div>
          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              disabled={isCreating || isUpdating}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
              disabled={isCreating || isUpdating}
            >
              {isCreating || isUpdating ? 'Saving...' : 'Save Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionFormModal;
