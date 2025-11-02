// src/api/index.js (COM O INTERCEPTOR)
import axios from 'axios';

const api = axios.create({
 	baseURL: 'http://localhost:3001/api'
});

// --- O MENSAGEIRO AUTOMÁTICO (INTERCEPTOR) ---
// Isso roda ANTES de qualquer "api.get" ou "api.post"
api.interceptors.request.use(
 	(config) => {
 		// 1. Pega o token do localStorage
 		const token = localStorage.getItem('token');
 		
 		// 2. Se o token existir, anexa ele no cabeçalho
 		if (token) {
 			config.headers['Authorization'] = `Bearer ${token}`;
 		}
 		
 		// 3. Retorna a configuração (com ou sem o token) para a chamada
 		return config;
 	},
 	(error) => {
 		// Em caso de erro, rejeita
 		return Promise.reject(error);
 	}
);
// --- FIM DO MENSAGEIRO ---

export default api;