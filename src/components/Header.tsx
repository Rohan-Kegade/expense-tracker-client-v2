import { User, Wallet, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";

interface HeaderProps {
  currentUser: any;
  onLogout: () => void;
}

export function Header({ currentUser, onLogout }: HeaderProps) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem("currentUser");
      navigate("/login");
      onLogout?.();
    }
  };

  return (
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
  );
}
