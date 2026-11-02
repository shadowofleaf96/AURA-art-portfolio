// API Service for AURA Client
// Connects to the Express backend (local or production live URL)

const API_BASE = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api`
  : 'http://localhost:5000/api';

// Helper for making HTTP requests with JSON and auth headers
async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.error || data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data;
}

export const api = {
  // Items / Artworks API
  async getItems(category = 'All Works') {
    const query = category && category !== 'All Works' 
      ? `?category=${encodeURIComponent(category)}` 
      : '';
    const res = await request(`/items${query}`);
    return res.data;
  },

  async getItemById(id) {
    const res = await request(`/items/${id}`);
    return res.data;
  },

  async createItem(itemData, token = null) {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await request('/items', {
      method: 'POST',
      headers,
      body: JSON.stringify(itemData),
    });
    return res.data;
  },

  // Services API
  async getServices() {
    const res = await request('/services');
    return res.data;
  },

  // Authentication API
  async signup({ name, email, password }) {
    return await request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  },

  async login({ email, password }) {
    return await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async getMe(token) {
    return await request('/auth/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Orders and Inquiries API
  async submitOrder(orderData, token = null) {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    return await request('/orders', {
      method: 'POST',
      headers,
      body: JSON.stringify(orderData),
    });
  },

  // Stripe Checkout API (Assignment 4)
  async createCheckoutSession(checkoutData, token) {
    if (!token) {
      throw new Error('Please sign in to proceed to checkout.');
    }
    const headers = { Authorization: `Bearer ${token}` };
    return await request('/checkout/create-session', {
      method: 'POST',
      headers,
      body: JSON.stringify(checkoutData),
    });
  },

  async getOrder(orderId, sessionId = null, token = null) {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const query = sessionId ? `?session_id=${encodeURIComponent(sessionId)}` : '';
    return await request(`/checkout/order/${orderId || 'lookup'}${query}`, {
      method: 'GET',
      headers,
    });
  },

  // Get logged-in user's order history
  async getMyOrders(token) {
    if (!token) throw new Error('Please sign in to view your orders.');
    const headers = { Authorization: `Bearer ${token}` };
    const res = await request('/orders/my-orders', {
      method: 'GET',
      headers,
    });
    return res.data || [];
  },
};

export default api;
