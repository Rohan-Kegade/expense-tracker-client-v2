// API Configuration
// Replace this with your actual backend API URL
const API_BASE_URL = "http://localhost:5000/api";

// Helper function to get auth token
const getAuthToken = (): string | null => {
  const user = localStorage.getItem("currentUser");
  if (user) {
    const parsed = JSON.parse(user);
    return parsed.token || null;
  }
  return null;
};

// Helper function for API requests
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = getAuthToken();

  const headers = new Headers({
    "Content-Type": "application/json",
  });

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Request failed" }));
      throw new Error(
        error.message || `HTTP error! status: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

// ==================== AUTH APIs ====================

export const authAPI = {
  // POST /auth/signup
  signup: async (data: { name: string; email: string; password: string }) => {
    return apiRequest("/auth/signup", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // POST /auth/login
  login: async (data: { email: string; password: string }) => {
    return apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // POST /auth/logout
  logout: async () => {
    return apiRequest("/auth/logout", {
      method: "POST",
    });
  },
};

// ==================== USER APIs ====================

export const userAPI = {
  // PUT /auth/update
  updateUser: async (data: { name?: string; email?: string }) => {
    return apiRequest("/users/update", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  // DELETE /auth/delete
  deleteAccount: async () => {
    return apiRequest("/users/delete", {
      method: "DELETE",
    });
  },
};

// ==================== EXPENSE APIs ====================

export const expenseAPI = {
  // GET /expenses - Get all expenses for current user
  getAll: async () => {
    return apiRequest("/expenses", {
      method: "GET",
    });
  },

  // POST /expenses - Create new expense
  create: async (expense: {
    amount: number;
    category: string;
    description: string;
    date: string;
  }) => {
    return apiRequest("/expenses", {
      method: "POST",
      body: JSON.stringify(expense),
    });
  },

  // PUT /expenses/:id - Update expense
  update: async (
    id: string,
    expense: {
      amount: number;
      category: string;
      description: string;
      date: string;
    }
  ) => {
    return apiRequest(`/expenses/${id}`, {
      method: "PUT",
      body: JSON.stringify(expense),
    });
  },

  // DELETE /expenses/:id - Delete expense
  delete: async (id: string) => {
    return apiRequest(`/expenses/${id}`, {
      method: "DELETE",
    });
  },
};

// ==================== CATEGORY APIs ====================

export const categoryAPI = {
  // GET /categories - Get all custom categories for current user
  getAll: async () => {
    return apiRequest("/categories", {
      method: "GET",
    });
  },

  // POST /categories - Create new category
  create: async (data: { name: string; budget?: number }) => {
    return apiRequest("/categories", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // DELETE /categories/:name - Delete category
  delete: async (name: string) => {
    return apiRequest(`/categories/${encodeURIComponent(name)}`, {
      method: "DELETE",
    });
  },
};

// ==================== BUDGET APIs ====================

export const budgetAPI = {
  // GET /budgets - Get all budgets for current user
  getAll: async () => {
    return apiRequest("/budgets", {
      method: "GET",
    });
  },

  // POST /budgets - Create or update budget
  upsert: async (data: { category: string; budget: number }) => {
    return apiRequest("/budgets", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // DELETE /budgets/:category - Delete budget
  delete: async (category: string) => {
    return apiRequest(`/budgets/${encodeURIComponent(category)}`, {
      method: "DELETE",
    });
  },
};

// ==================== MOCK API (For Development) ====================
// Remove this section when connecting to real backend

const USE_MOCK_API = false; // Set to false when backend is ready

if (USE_MOCK_API) {
  console.warn("Using MOCK API - Replace with real backend endpoints");

  // Mock data storage
  let mockUsers: any[] = [
    {
      id: "1",
      name: "Demo User",
      email: "demo@example.com",
      password: "demo123",
    },
  ];
  let mockExpenses: any[] = [];
  let mockCategories: any[] = [];
  let mockBudgets: any[] = [];

  // Override API functions with mock implementations
  (authAPI as any).signup = async (data: any) => {
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay

    if (mockUsers.find((u) => u.email === data.email)) {
      throw new Error("Email already registered");
    }

    const newUser = {
      id: Date.now().toString(),
      ...data,
    };
    mockUsers.push(newUser);

    return {
      user: { id: newUser.id, name: newUser.name, email: newUser.email },
      token: `mock_token_${newUser.id}`,
    };
  };

  (authAPI as any).login = async (data: any) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const user = mockUsers.find(
      (u) => u.email === data.email && u.password === data.password
    );
    if (!user) {
      throw new Error("Invalid email or password");
    }

    return {
      user: { id: user.id, name: user.name, email: user.email },
      token: `mock_token_${user.id}`,
    };
  };

  (authAPI as any).logout = async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { message: "Logged out successfully" };
  };

  (expenseAPI as any).getAll = async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const token = getAuthToken();
    const userId = token?.split("_")[2];
    return mockExpenses.filter((e) => e.userId === userId);
  };

  (expenseAPI as any).create = async (expense: any) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const token = getAuthToken();
    const userId = token?.split("_")[2];
    const newExpense = {
      id: Date.now().toString(),
      ...expense,
      userId,
    };
    mockExpenses.unshift(newExpense);
    return newExpense;
  };

  (expenseAPI as any).update = async (id: string, expense: any) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const index = mockExpenses.findIndex((e) => e.id === id);
    if (index >= 0) {
      mockExpenses[index] = { ...mockExpenses[index], ...expense };
      return mockExpenses[index];
    }
    throw new Error("Expense not found");
  };

  (expenseAPI as any).delete = async (id: string) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    mockExpenses = mockExpenses.filter((e) => e.id !== id);
    return { message: "Deleted successfully" };
  };

  (categoryAPI as any).getAll = async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const token = getAuthToken();
    const userId = token?.split("_")[2];
    return mockCategories.filter((c) => c.userId === userId);
  };

  (categoryAPI as any).create = async (data: any) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const token = getAuthToken();
    const userId = token?.split("_")[2];
    const newCategory = {
      id: Date.now().toString(),
      name: data.name,
      userId,
    };
    mockCategories.push(newCategory);

    if (data.budget) {
      const newBudget = {
        id: Date.now().toString(),
        category: data.name,
        budget: data.budget,
        userId,
      };
      mockBudgets.push(newBudget);
    }

    return newCategory;
  };

  (budgetAPI as any).getAll = async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const token = getAuthToken();
    const userId = token?.split("_")[2];
    return mockBudgets.filter((b) => b.userId === userId);
  };

  (budgetAPI as any).upsert = async (data: any) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const token = getAuthToken();
    const userId = token?.split("_")[2];

    const existingIndex = mockBudgets.findIndex(
      (b) => b.category === data.category && b.userId === userId
    );

    if (existingIndex >= 0) {
      mockBudgets[existingIndex].budget = data.budget;
      return mockBudgets[existingIndex];
    } else {
      const newBudget = {
        id: Date.now().toString(),
        ...data,
        userId,
      };
      mockBudgets.push(newBudget);
      return newBudget;
    }
  };

  (budgetAPI as any).delete = async (category: string) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const token = getAuthToken();
    const userId = token?.split("_")[2];
    mockBudgets = mockBudgets.filter(
      (b) => !(b.category === category && b.userId === userId)
    );
    return { message: "Deleted successfully" };
  };
}
