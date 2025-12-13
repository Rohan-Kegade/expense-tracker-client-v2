import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Calendar,
  TrendingDown,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Edit2,
  Check,
  X,
} from "lucide-react";
import { Expense } from "./Dashboard";
import { getCategoryColor } from "../utils/categoryColors";

interface AnalyticsProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
  onUpdateExpense: (id: string, expense: Omit<Expense, "_id">) => void;
  categories: string[];
}

const ITEMS_PER_PAGE = 10;

export function Analytics({
  expenses,
  onDeleteExpense,
  onUpdateExpense,
  categories,
}: AnalyticsProps) {
  const [viewMode, setViewMode] = useState<"monthly" | "yearly">("monthly");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [currentPage, setCurrentPage] = useState(1);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Omit<Expense, "_id">>({
    amount: 0,
    category: "",
    description: "",
    date: "",
  });

  // Monthly data - shows daily expenses for the selected month
  const monthlyData = useMemo(() => {
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const data = Array.from({ length: daysInMonth }, (_, i) => ({
      day: i + 1,
      amount: 0,
    }));

    expenses.forEach((expense) => {
      const date = new Date(expense.date);
      if (
        date.getFullYear() === selectedYear &&
        date.getMonth() === selectedMonth
      ) {
        const day = date.getDate();
        data[day - 1].amount += expense.amount;
      }
    });

    return data;
  }, [expenses, selectedYear, selectedMonth]);

  const monthlyStackedData = useMemo(() => {
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();

    const data = Array.from({ length: daysInMonth }, (_, i) => {
      const obj: any = { day: i + 1 };
      categories.forEach((cat) => (obj[cat] = 0));
      return obj;
    });

    expenses.forEach((expense) => {
      const date = new Date(expense.date);
      if (
        date.getFullYear() === selectedYear &&
        date.getMonth() === selectedMonth
      ) {
        const day = date.getDate() - 1;
        data[day][expense.category] += expense.amount;
      }
    });

    return data;
  }, [expenses, selectedYear, selectedMonth, categories]);

  const yearlyStackedData = useMemo(() => {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const data = monthNames.map((name, idx) => {
      const obj: any = { month: name };
      categories.forEach((cat) => (obj[cat] = 0));
      return obj;
    });

    expenses.forEach((expense) => {
      const date = new Date(expense.date);
      if (date.getFullYear() === selectedYear) {
        const m = date.getMonth();
        data[m][expense.category] += expense.amount;
      }
    });

    return data;
  }, [expenses, selectedYear, categories]);

  const categoryData = useMemo(() => {
    const filtered = expenses.filter((expense) => {
      const date = new Date(expense.date);
      if (viewMode === "monthly") {
        return (
          date.getFullYear() === selectedYear &&
          date.getMonth() === selectedMonth
        );
      } else {
        return date.getFullYear() === selectedYear;
      }
    });

    const categories: Record<string, number> = {};
    filtered.forEach((expense) => {
      categories[expense.category] =
        (categories[expense.category] || 0) + expense.amount;
    });

    return Object.entries(categories)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [expenses, viewMode, selectedYear, selectedMonth]);

  const filteredExpenses = useMemo(() => {
    return expenses
      .filter((expense) => {
        const date = new Date(expense.date);
        if (viewMode === "monthly") {
          return (
            date.getFullYear() === selectedYear &&
            date.getMonth() === selectedMonth
          );
        } else {
          return date.getFullYear() === selectedYear;
        }
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [expenses, viewMode, selectedYear, selectedMonth]);

  const totalSpent = useMemo(() => {
    return filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  }, [filteredExpenses]);

  const avgDaily = useMemo(() => {
    if (filteredExpenses.length === 0) return 0;
    const days =
      viewMode === "monthly"
        ? new Date(selectedYear, selectedMonth + 1, 0).getDate()
        : 365;
    return totalSpent / days;
  }, [filteredExpenses, viewMode, selectedYear, selectedMonth, totalSpent]);

  const availableYears = useMemo(() => {
    const years = new Set(
      expenses.map((exp) => new Date(exp.date).getFullYear())
    );
    return Array.from(years).sort((a, b) => b - a);
  }, [expenses]);

  // Pagination
  const totalPages = Math.ceil(filteredExpenses.length / ITEMS_PER_PAGE);
  const paginatedExpenses = filteredExpenses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const months = [
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

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

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

  const cancelEdit = () => {
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex gap-2">
            <button
              onClick={() => {
                setViewMode("monthly");
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-lg transition-colors ${
                viewMode === "monthly"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => {
                setViewMode("yearly");
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-lg transition-colors ${
                viewMode === "yearly"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Yearly
            </button>
          </div>

          <select
            value={selectedYear}
            onChange={(e) => {
              setSelectedYear(parseInt(e.target.value));
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {availableYears.length > 0 ? (
              availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))
            ) : (
              <option value={new Date().getFullYear()}>
                {new Date().getFullYear()}
              </option>
            )}
          </select>

          {viewMode === "monthly" && (
            <select
              value={selectedMonth}
              onChange={(e) => {
                setSelectedMonth(parseInt(e.target.value));
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {months.map((month, index) => (
                <option key={index} value={index}>
                  {month}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-8 h-8" />
            <p className="text-blue-100">Total Spent</p>
          </div>
          <p className="text-3xl">${totalSpent.toFixed(2)}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-8 h-8" />
            <p className="text-purple-100">Avg. Daily</p>
          </div>
          <p className="text-3xl">${avgDaily.toFixed(2)}</p>
        </div>

        <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <TrendingDown className="w-8 h-8" />
            <p className="text-pink-100">Transactions</p>
          </div>
          <p className="text-3xl">{filteredExpenses.length}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spending Trend */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl mb-4">
            {viewMode === "monthly"
              ? `Daily Spending - ${months[selectedMonth]} ${selectedYear}`
              : `Monthly Spending - ${selectedYear}`}
          </h3>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={
                viewMode === "monthly" ? monthlyStackedData : yearlyStackedData
              }
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

              <XAxis
                dataKey={viewMode === "monthly" ? "day" : "month"}
                stroke="#6b7280"
              />

              <YAxis stroke="#6b7280" />

              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                }}
              />

              {categories.map((cat, index) => (
                <Bar
                  key={cat}
                  dataKey={cat}
                  stackId="a"
                  fill={getCategoryColor(cat)}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl mb-4">Category Breakdown</h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={getCategoryColor(entry.name)}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400">
              No data for this period
            </div>
          )}
        </div>

        {/* Category Bar Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6 lg:col-span-2">
          <h3 className="text-xl mb-4">Spending by Category</h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={getCategoryColor(entry.name)}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400">
              No data for this period
            </div>
          )}
        </div>
      </div>

      {/* Transaction List */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-2xl mb-4">
          All Transactions -{" "}
          {viewMode === "monthly"
            ? `${months[selectedMonth]} ${selectedYear}`
            : selectedYear}
        </h3>

        {filteredExpenses.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p>No transactions for this period</p>
          </div>
        ) : (
          <>
            <div className="space-y-3 mb-6">
              {paginatedExpenses.map((expense) => (
                <div
                  key={expense._id}
                  className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow"
                >
                  {editingId === expense._id ? (
                    <div className="space-y-3">
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
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <select
                        value={editForm.category}
                        onChange={(e) =>
                          setEditForm({ ...editForm, category: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={editForm.description}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            description: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="date"
                        value={editForm.date}
                        onChange={(e) =>
                          setEditForm({ ...editForm, date: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={saveEdit}
                          className="flex items-center gap-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                        >
                          <Check className="w-4 h-4" />
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="flex items-center gap-1 px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                        >
                          <X className="w-4 h-4" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-xl">
                            ${expense.amount.toFixed(2)}
                          </span>
                          <span
                            className="px-3 py-1 rounded-full text-xs text-white"
                            style={{
                              backgroundColor: getCategoryColor(
                                expense.category
                              ),
                            }}
                          >
                            {expense.category}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-1">
                          {expense.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(expense.date)}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(expense)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteExpense(expense._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
                  {Math.min(
                    currentPage * ITEMS_PER_PAGE,
                    filteredExpenses.length
                  )}{" "}
                  of {filteredExpenses.length} transactions
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-4 py-2 rounded-lg transition-colors ${
                            currentPage === page
                              ? "bg-blue-600 text-white"
                              : "border border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      )
                    )}
                  </div>
                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
