// src/App.jsx (CAMINHOS 100% CORRIGIDOS)
import React, { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// CAMINHOS CORRIGIDOS: De 'src' para 'src/screens' é "./screens/"
import AuthScreen from './screens/AuthScreen.jsx';
import BookingProcess from './screens/BookingProcess.jsx';
import AdminDashboard from './screens/AdminDashboard.jsx';
import ClientDashboard from './screens/ClientDashboard.jsx'; 
import RedefinirSenha from './screens/RedefinirSenha.jsx'; // ajuste o caminho conforme a pasta


export default function App() {
 	const [token, setToken] = useState(null);
 	const [user, setUser] = useState(null);
 	const [loading, setLoading] = useState(true);
	const [resetMode, setResetMode] = useState(false);

 	useEffect(() => {
 		try {
 			const storedToken = localStorage.getItem('token');
 			const storedUser = localStorage.getItem('user');
 			if (storedToken && storedUser) {
 				setToken(storedToken);
 				setUser(JSON.parse(storedUser));
 			}
 		} catch (error) {
 			localStorage.clear();
 			console.error("Erro ao carregar dados do usuário do localStorage:", error);
 		} finally {
 			setLoading(false);
 		}
 	}, []);

 	const handleLogin = (userData, userToken) => {
 		localStorage.setItem('token', userToken);
 		localStorage.setItem('user', JSON.stringify(userData));
 		setToken(userToken);
 		setUser(userData);
 	};

 	const logout = () => {
 		localStorage.removeItem('token');
 		localStorage.removeItem('user');
 		setToken(null);
 		setUser(null);
 	};

 	let pageContent;
 	if (loading) {
 		pageContent = <div className="min-h-screen flex items-center justify-center text-gray-700">Carregando...</div>;
	 } else if (resetMode) {
    	pageContent = <RedefinirSenha onBack={() => setResetMode(false)} user={user} />; //novo
 	} else if (!token || !user) {
 		pageContent = <AuthScreen onLogin={handleLogin} />;
 	} else if (user.role === 'admin') {
 		pageContent = <AdminDashboard user={user} onLogout={logout} />;
 	} else {
 		pageContent = <ClientDashboard user={user} onLogout={logout} />;
 	}

 	return (
 		<>
 			<ToastContainer
 				position="top-right"
 				autoClose={4000}
 				hideProgressBar={false}
 				newestOnTop={false}
 				closeOnClick
 				rtl={false}
 				pauseOnFocusLoss
 				draggable
 				pauseOnHover
 				theme="light"
 			/>
 			{pageContent}
 		</>
 	);
}