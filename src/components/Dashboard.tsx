import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ExpenseForm } from "./ExpenseForm";
import { ExpenseList } from "./ExpenseList";
import { Analytics } from "./Analytics";
import { Budget } from "./Budget";
import {
  TrendingUp,
  Wallet,
  LogOut,
  User,
  PiggyBank,
  Loader2,
} from "lucide-react";
import { expenseAPI, categoryAPI, budgetAPI, authAPI } from "../services/api";

export interface Expense {
  _id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}

export interface CategoryBudget {
  category: string;
  budget: number;
}

export function Dashboard() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [activeView, setActiveView] = useState<
    "expenses" | "analytics" | "budget"
  >("expenses");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [budgets, setBudgets] = useState<CategoryBudget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, [navigate]);

  const loadData = async () => {
    try {
      // Check if user is logged in
      const user = localStorage.getItem("currentUser");
      if (!user) {
        navigate("/login");
        return;
      }
      setCurrentUser(JSON.parse(user));

      // Load all data from API
      const [expensesData, categoriesData, budgetsData] = await Promise.all([
        expenseAPI.getAll(),
        categoryAPI.getAll(),
        budgetAPI.getAll(),
      ]);

      setExpenses(expensesData);
      setCategories(categoriesData.map((c: any) => c.name));
      setBudgets(budgetsData);
    } catch (err: any) {
      console.error("Error loading data:", err);
      setError(err.message || "Failed to load data");

      // If unauthorized, redirect to login
      if (
        err.message?.includes("unauthorized") ||
        err.message?.includes("401")
      ) {
        localStorage.removeItem("currentUser");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem("currentUser");
      navigate("/login");
    }
  };

  const addExpense = async (expense: Omit<Expense, "_id">) => {
    try {
      const newExpense = await expenseAPI.create(expense);
      setExpenses([newExpense, ...expenses]);
    } catch (err: any) {
      alert(err.message || "Failed to add expense");
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      await expenseAPI.delete(id);
      setExpenses(expenses.filter((exp) => exp._id !== id));
    } catch (err: any) {
      alert(err.message || "Failed to delete expense");
    }
  };

  const updateExpense = async (
    id: string,
    updatedExpense: Omit<Expense, "_id">
  ) => {
    try {
      const updated = await expenseAPI.update(id, updatedExpense);
      setExpenses(expenses.map((exp) => (exp._id === id ? updated : exp)));
    } catch (err: any) {
      alert(err.message || "Failed to update expense");
    }
  };

  const addCategory = async (category: string, budget?: number) => {
    try {
      if (!categories.includes(category)) {
        await categoryAPI.create({ name: category, budget });
        setCategories([...categories, category]);

        if (budget !== undefined && budget > 0) {
          const newBudget = { category, budget };
          setBudgets([...budgets, newBudget]);
        }
      }
    } catch (err: any) {
      alert(err.message || "Failed to add category");
    }
  };

  const updateBudget = async (category: string, budget: number) => {
    try {
      await budgetAPI.upsert({ category, budget });

      const existingBudgetIndex = budgets.findIndex(
        (b) => b.category === category
      );
      if (existingBudgetIndex >= 0) {
        const newBudgets = [...budgets];
        newBudgets[existingBudgetIndex] = { category, budget };
        setBudgets(newBudgets);
      } else {
        setBudgets([...budgets, { category, budget }]);
      }
    } catch (err: any) {
      alert(err.message || "Failed to update budget");
    }
  };

  const deleteBudget = async (category: string) => {
    try {
      await budgetAPI.delete(category);
      setBudgets(budgets.filter((b) => b.category !== category));
    } catch (err: any) {
      alert(err.message || "Failed to delete budget");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadData}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl">Expense Tracker</h1>
                <p className="text-gray-600">
                  Welcome back, {currentUser.name}!
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-200">
                <User className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">{currentUser.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-white text-red-600 rounded-xl border border-red-200 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Navigation */}
        <div className="flex gap-4 mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveView("expenses")}
            className={`px-6 py-3 rounded-xl transition-all whitespace-nowrap ${
              activeView === "expenses"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Expenses
          </button>
          <button
            onClick={() => setActiveView("analytics")}
            className={`px-6 py-3 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
              activeView === "analytics"
                ? "bg-purple-600 text-white shadow-lg shadow-purple-200"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Analytics
          </button>
          <button
            onClick={() => setActiveView("budget")}
            className={`px-6 py-3 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
              activeView === "budget"
                ? "bg-green-600 text-white shadow-lg shadow-green-200"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            <PiggyBank className="w-4 h-4" />
            Budget
          </button>
        </div>

        {/* Content */}
        {activeView === "expenses" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <ExpenseForm
                onAddExpense={addExpense}
                categories={categories}
                onAddCategory={addCategory}
              />
            </div>
            <div className="lg:col-span-2">
              <ExpenseList
                expenses={expenses.slice(0, 20)}
                onDeleteExpense={deleteExpense}
                onUpdateExpense={updateExpense}
                categories={categories}
              />
            </div>
          </div>
        ) : activeView === "analytics" ? (
          <Analytics
            expenses={expenses}
            onDeleteExpense={deleteExpense}
            onUpdateExpense={updateExpense}
            categories={categories}
          />
        ) : (
          <Budget
            expenses={expenses}
            budgets={budgets}
            categories={categories}
            onUpdateBudget={updateBudget}
            onDeleteBudget={deleteBudget}
            onAddCategory={addCategory}
          />
        )}
      </div>
    </div>
  );
}
