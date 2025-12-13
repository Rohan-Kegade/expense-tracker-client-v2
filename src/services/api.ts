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
        error.message || `HTTP error! status: ${response.status}`,
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
    },
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
