import axios from "axios"

const API_BASE_URL = "https://siska-production.up.railway.app/api"

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Log request untuk debugging
    console.log(`Making ${config.method?.toUpperCase()} request to:`, config.url)

    return config
  },
  (error) => {
    console.error("Request interceptor error:", error)
    return Promise.reject(error)
  },
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`Response received from ${response.config.url}:`, response.status)
    return response
  },
  (error) => {
    console.error("API Error:", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
    })

    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      window.location.href = "/login"
    }

    // Handle network errors
    if (error.code === "NETWORK_ERROR" || error.message === "Network Error") {
      console.error("Network error detected")
    }

    // Handle timeout errors
    if (error.code === "ECONNABORTED") {
      console.error("Request timeout")
    }

    return Promise.reject(error)
  },
)

export default api
