import { TrendingUp, PiggyBank } from "lucide-react";

interface NavbarProps {
  activeView: "expenses" | "analytics" | "budget";
  onChangeView: (view: "expenses" | "analytics" | "budget") => void;
}

export function Navbar({ activeView, onChangeView }: NavbarProps) {
  return (
    <div className="flex gap-4 mb-8 overflow-x-auto">
      <button
        onClick={() => onChangeView("expenses")}
        className={`px-6 py-3 rounded-xl transition-all whitespace-nowrap ${
          activeView === "expenses"
            ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
            : "bg-white text-gray-700 hover:bg-gray-50"
        }`}
      >
        Expenses
      </button>
      <button
        onClick={() => onChangeView("analytics")}
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
        onClick={() => onChangeView("budget")}
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
  );
}
