import api from "./api";

export const authAPI = {
  loginUser: (email, password) =>
    api.post("/api/auth/login", { email, password }),
  registerUser: (name, email, password) =>
    api.post("/api/auth/register", {
      name,
      email,
      password,
    }),
  forgetUserPassword: (email) =>
    api.post("/api/auth/forgot-password", { email }),
  verifyUserOtp: (email, otp) =>
    api.post("/api/auth/verify-otp", {
      email,
      otp,
    }),
  resetUserPassword: (resetToken, newPassword) =>
    api.post("/api/auth/reset-password", {
      resetToken,
      newPassword,
    }),
};

export const tripAPI = {
  generate: (data) => api.post("/api/trips/generate", data),
  getAll: () => api.get("/api/trips"),
  getById: (id) => api.get(`/api/trips/${id}`),
  update: (id, data) => api.put(`/api/trips/${id}`, data),
  delete: (id) => api.delete(`/api/trips/${id}`),
};

export const aiAPI = {
  chat: (message, context) => api.post("/api/ai/chat", { message, context }),
  packingSuggestions: (data) => api.post("/api/ai/packing-suggestions", data),
};

export const weatherAPI = {
  getWeather: (city) => api.get("/api/weather", { params: { city } }),
  getForecast: (city) => api.get("/api/weather/forecast", { params: { city } }),
};

export const profileAPI = {
  getProfile: () => api.get("/api/auth/profile"),
  profileUpdate: (data) => api.put("/api/auth/profile", data),
  getPreferences: () => api.get("/api/auth/preferences"),
  updatePreferences: (preferences) =>
    api.put("/api/auth/preferences", preferences),
};
