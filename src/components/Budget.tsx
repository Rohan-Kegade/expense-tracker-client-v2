import { useMemo, useState } from "react";
import {
  PiggyBank,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  AlertTriangle,
} from "lucide-react";
import { Expense, CategoryBudget } from "../pages/Dashboard";

interface BudgetProps {
  expenses: Expense[];
  budgets: CategoryBudget[];
  categories: string[];
  onUpdateBudget: (category: string, budget: number) => void;
  onDeleteBudget: (category: string) => void;
  onAddCategory: (category: string, budget?: number) => void;
}

export function Budget({
  expenses,
  budgets,
  categories,
  onUpdateBudget,
  onDeleteBudget,
  onAddCategory,
}: BudgetProps) {
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editBudget, setEditBudget] = useState("");
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [newBudget, setNewBudget] = useState("");

  // const allCategories = [...defaultCategories, ...customCategories];

  // Get current month and year
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Calculate spending per category for current month
  const categorySpending = useMemo(() => {
    const spending: Record<string, number> = {};

    categories.forEach((cat) => {
      spending[cat] = 0;
    });

    expenses.forEach((expense) => {
      const expenseDate = new Date(expense.date);
      if (
        expenseDate.getMonth() === currentMonth &&
        expenseDate.getFullYear() === currentYear
      ) {
        spending[expense.category] =
          (spending[expense.category] || 0) + expense.amount;
      }
    });

    return spending;
  }, [expenses, currentMonth, currentYear, categories]);

  // Get all categories with budgets or spending
  const categoriesWithData = useMemo(() => {
    const all = new Set<string>();

    // Add every category from backend (default + user-created)
    categories.forEach((cat) => all.add(cat));

    // Add categories that have budgets
    budgets.forEach((b) => all.add(b.category));

    // Add categories with spending
    Object.keys(categorySpending).forEach((cat) => all.add(cat));

    return Array.from(all).sort();
  }, [categories, budgets, categorySpending]);

  const getBudgetForCategory = (category: string): number => {
    const budget = budgets.find((b) => b.category === category);
    return budget ? budget.budget : 0;
  };

  const getPercentage = (spent: number, budget: number): number => {
    if (budget === 0) return 0;
    return Math.min((spent / budget) * 100, 100);
  };

  const getProgressColor = (percentage: number): string => {
    if (percentage >= 100) return "bg-red-500";
    if (percentage >= 80) return "bg-orange-500";
    if (percentage >= 60) return "bg-yellow-500";
    return "bg-green-500";
  };

  const handleEditBudget = (category: string) => {
    const budget = getBudgetForCategory(category);
    setEditingCategory(category);
    setEditBudget(budget.toString());
  };

  const handleSaveBudget = () => {
    if (editingCategory && editBudget) {
      const budget = parseFloat(editBudget);
      if (budget > 0) {
        onUpdateBudget(editingCategory, budget);
        setEditingCategory(null);
        setEditBudget("");
      } else {
        alert("Please enter a valid budget amount");
      }
    }
  };

  const handleAddNewCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      const budget = newBudget ? parseFloat(newBudget) : undefined;
      if (budget !== undefined && budget <= 0) {
        alert("Please enter a valid budget amount");
        return;
      }
      onAddCategory(newCategory.trim(), budget);
      setNewCategory("");
      setNewBudget("");
      setShowAddCategory(false);
    } else {
      alert("Category already exists or is empty");
    }
  };

  const totalBudget = budgets.reduce((sum, b) => sum + b.budget, 0);
  const totalSpent = Object.values(categorySpending).reduce(
    (sum, amount) => sum + amount,
    0,
  );
  const totalPercentage =
    totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-3xl mb-2">Monthly Budget</h2>
            <p className="text-gray-600">
              Current Month: {monthNames[currentMonth]} {currentYear}
            </p>
          </div>
          <button
            onClick={() => setShowAddCategory(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Category
          </button>
        </div>

        {/* Overall Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
            <p className="text-blue-100 text-sm mb-1">Total Budget</p>
            <p className="text-2xl">${totalBudget.toFixed(2)}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
            <p className="text-purple-100 text-sm mb-1">Total Spent</p>
            <p className="text-2xl">${totalSpent.toFixed(2)}</p>
          </div>
          <div
            className={`rounded-xl p-4 text-white ${
              totalPercentage >= 100
                ? "bg-gradient-to-br from-red-500 to-red-600"
                : totalPercentage >= 80
                  ? "bg-gradient-to-br from-orange-500 to-orange-600"
                  : "bg-gradient-to-br from-green-500 to-green-600"
            }`}
          >
            <p className="text-white/90 text-sm mb-1">Remaining</p>
            <p className="text-2xl">
              ${Math.max(0, totalBudget - totalSpent).toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Add New Category Modal */}
      {showAddCategory && (
        <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-green-200">
          <h3 className="text-xl mb-4">Add New Category with Budget</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Category Name
              </label>
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter category name"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Monthly Budget (Optional)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  value={newBudget}
                  onChange={(e) => setNewBudget(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAddNewCategory}
                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" />
                Add Category
              </button>
              <button
                onClick={() => {
                  setShowAddCategory(false);
                  setNewCategory("");
                  setNewBudget("");
                }}
                className="px-4 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Budgets */}
      <div className="space-y-4">
        {categoriesWithData.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <PiggyBank className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">No budgets set yet</p>
            <button
              onClick={() => setShowAddCategory(true)}
              className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Your First Budget
            </button>
          </div>
        ) : (
          categoriesWithData.map((category) => {
            const spent = categorySpending[category] || 0;
            const budget = getBudgetForCategory(category);
            const percentage = getPercentage(spent, budget);
            const isEditing = editingCategory === category;

            return (
              <div
                key={category}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl mb-1">{category}</h3>
                    {budget > 0 ? (
                      <p className="text-sm text-gray-600">
                        ${spent.toFixed(2)} of ${budget.toFixed(2)} spent
                      </p>
                    ) : (
                      <p className="text-sm text-gray-600">
                        ${spent.toFixed(2)} spent (No budget set)
                      </p>
                    )}
                  </div>
                  {!isEditing && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditBudget(category)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Budget"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      {budget > 0 && (
                        <button
                          onClick={() => {
                            if (
                              window.confirm(`Remove budget for ${category}?`)
                            ) {
                              onDeleteBudget(category);
                            }
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove Budget"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {isEditing ? (
                  <div className="space-y-3">
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                        $
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        value={editBudget}
                        onChange={(e) => setEditBudget(e.target.value)}
                        className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0.00"
                        autoFocus
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveBudget}
                        className="flex items-center gap-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                      >
                        <Check className="w-4 h-4" />
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingCategory(null);
                          setEditBudget("");
                        }}
                        className="flex items-center gap-1 px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : budget > 0 ? (
                  <div>
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-4 mb-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${getProgressColor(
                          percentage,
                        )}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {percentage.toFixed(1)}% used
                      </span>
                      <span
                        className={`${
                          spent > budget ? "text-red-600" : "text-green-600"
                        }`}
                      >
                        ${(budget - spent).toFixed(2)} remaining
                      </span>
                    </div>
                    {spent > budget && (
                      <div className="mt-3 flex items-center gap-2 text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-sm">
                          Over budget by ${(spent - budget).toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500 mb-2">
                      No budget set for this category
                    </p>
                    <button
                      onClick={() => handleEditBudget(category)}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      Set Budget
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
