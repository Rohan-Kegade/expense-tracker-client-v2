import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Expense } from "../pages/Dashboard";

interface ExpenseFormProps {
  onAddExpense: (expense: Omit<Expense, "_id">) => void;
  categories: string[];
  onAddCategory: (category: string, budget?: number) => void;
}

export function ExpenseForm({
  onAddExpense,
  categories,
  onAddCategory,
}: ExpenseFormProps) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [newCategoryBudget, setNewCategoryBudget] = useState("");
  const [setBudgetForCategory, setSetBudgetForCategory] = useState(false);

  // const allCategories = [...defaultCategories, ...customCategories];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || parseFloat(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    onAddExpense({
      amount: parseFloat(amount),
      category,
      description,
      date,
    });

    setAmount("");
    setDescription("");
    setDate(new Date().toISOString().split("T")[0]);
  };

  const handleAddNewCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      const budget =
        setBudgetForCategory && newCategoryBudget
          ? parseFloat(newCategoryBudget)
          : undefined;
      onAddCategory(newCategory.trim(), budget);
      setCategory(newCategory.trim());
      setNewCategory("");
      setNewCategoryBudget("");
      setSetBudgetForCategory(false);
      setShowNewCategory(false);
    } else {
      alert("Category already exists or is empty");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl mb-6">Add Expense</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-600 mb-2">Amount</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
              $
            </span>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-2">Category</label>
          {!showNewCategory ? (
            <div className="space-y-2">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setShowNewCategory(true)}
                className="w-full px-4 py-2 text-sm text-blue-600 border border-blue-200 rounded-xl hover:bg-blue-50 transition-colors"
              >
                + Add New Category
              </button>
            </div>
          ) : (
            <div className="space-y-3 p-4 border border-gray-200 rounded-xl bg-gray-50">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter category name"
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={setBudgetForCategory}
                    onChange={(e) => setSetBudgetForCategory(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700">
                    Set monthly budget for this category
                  </span>
                </label>

                {setBudgetForCategory && (
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      value={newCategoryBudget}
                      onChange={(e) => setNewCategoryBudget(e.target.value)}
                      className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleAddNewCategory}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Category
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowNewCategory(false);
                    setNewCategory("");
                    setNewCategoryBudget("");
                    setSetBudgetForCategory(false);
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-2">
            Description
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="What did you spend on?"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-2">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Expense
        </button>
      </form>
    </div>
  );
}
