import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
  headers: { 'Content-Type': 'application/json' },
});

// Her isteğe token ekle
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

// Hata mesajlarını düzgünleştir
apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error.response?.status;
    const backendMsg = error.response?.data?.message || error.response?.data?.Message;
    if (status === 401) {
      error.message = backendMsg || 'Oturum geçersiz. Lütfen tekrar giriş yapın.';
    } else if (status === 403) {
      error.message = backendMsg || 'Yetkiniz yok.';
}
    else if (status >= 500) {
      error.message = backendMsg || 'Sunucu hatası.';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
