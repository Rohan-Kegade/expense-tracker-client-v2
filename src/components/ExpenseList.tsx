import { useState } from "react";
import { Trash2, Edit2, Check, X, Calendar } from "lucide-react";
import { Expense } from "../pages/Dashboard";
import { getCategoryColor } from "../utils/categoryColors";

interface ExpenseListProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
  onUpdateExpense: (id: string, expense: Omit<Expense, "_id">) => void;
  categories: string[];
}

export function ExpenseList({
  expenses,
  onDeleteExpense,
  onUpdateExpense,
  categories,
}: ExpenseListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Omit<Expense, "_id">>({
    amount: 0,
    category: "",
    description: "",
    date: "",
  });

  const startEdit = (expense: Expense) => {
    setEditingId(expense._id);
    setEditForm({
      amount: expense.amount,
      category: expense.category,
      description: expense.description,
      date: expense.date,
    });
  };

  const saveEdit = () => {
    if (editingId) {
      onUpdateExpense(editingId, editForm);
      setEditingId(null);
    }
  };

  const cancelEdit = () => setEditingId(null);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl mb-6">Recent Expenses</h2>

      {expenses.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p>No expenses yet. Add your first expense to get started!</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {expenses.map((expense) => (
            <div
              key={expense._id}
              className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow"
            >
              {editingId === expense._id ? (
                <div className="space-y-3">
                  {/* Amount */}
                  <input
                    type="number"
                    step="0.01"
                    value={editForm.amount}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        amount: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />

                  {/* Category */}
                  <select
                    value={editForm.category}
                    onChange={(e) =>
                      setEditForm({ ...editForm, category: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>

                  {/* Description */}
                  <input
                    type="text"
                    value={editForm.description}
                    onChange={(e) =>
                      setEditForm({ ...editForm, description: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />

                  {/* Date */}
                  <input
                    type="date"
                    value={editForm.date}
                    onChange={(e) =>
                      setEditForm({ ...editForm, date: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />

                  {/* Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={saveEdit}
                      className="flex items-center gap-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                      <Check className="w-4 h-4" /> Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="flex items-center gap-1 px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                    >
                      <X className="w-4 h-4" /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    {/* Amount + Category Badge */}
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xl">
                        ${expense.amount.toFixed(2)}
                      </span>

                      {/* 🔥 Now uses util color function */}
                      <span
                        className="px-3 py-1 rounded-full text-xs text-white"
                        style={{
                          backgroundColor: getCategoryColor(expense.category),
                        }}
                      >
                        {expense.category}
                      </span>
                    </div>

                    <p className="text-gray-700">{expense.description}</p>

                    <div className="flex items-center mt-1 text-sm text-gray-500 gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(expense.date)}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(expense)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onDeleteExpense(expense._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
