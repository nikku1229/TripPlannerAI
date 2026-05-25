import api from "./api";

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
  profileUpdate: (data) => api.put("/api/auth/profile", data),
  getPreferences: () => api.get("/api/auth/preferences"),
  updatePreferences: (preferences) =>
    api.put("/api/auth/preferences", preferences),
};
