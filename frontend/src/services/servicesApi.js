import api from "./api";

export const tripAPI = {
  generate: (data) => api.post("/trips/generate", data),
  getAll: () => api.get("/trips"),
  getById: (id) => api.get(`/trips/${id}`),
  update: (id, data) => api.put(`/trips/${id}`, data),
  delete: (id) => api.delete(`/trips/${id}`),
};

export const aiAPI = {
  chat: (message, context) => api.post("/ai/chat", { message, context }),
  packingSuggestions: (data) => api.post("/ai/packing-suggestions", data),
};

export const weatherAPI = {
  getWeather: (city) => api.get("/weather", { params: { city } }),
  getForecast: (city) => api.get("/weather/forecast", { params: { city } }),
};
