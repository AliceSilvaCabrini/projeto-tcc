// src/screens/AuthScreen.jsx (CAMINHOS 100% CORRIGIDOS)
import React, { useState } from 'react';
// CAMINHOS CORRIGIDOS: De 'src/screens' para 'src/components' é "../components/"
import SalonInfo from '../components/Auth/SalonInfo.jsx';
import LoginForm from '../components/Auth/LoginForm.jsx';
import RegisterForm from '../components/Auth/RegisterForm.jsx';

export default function AuthScreen({ onLogin }) {
 	const [isLoginView, setIsLoginView] = useState(true);

 	return (
 		<>
 			<style>{`@import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap'); .font-title { font-family: 'Great Vibes', cursive; }`}</style>
 			<div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 font-sans overflow-hidden relative">
 				
 				<div className="absolute inset-0">
 					<img 
 						src="/fundo.jpg" // Da pasta /public
 						alt="Fundo do Salão" 
 						className="w-full h-full object-cover opacity-40" 
 					/>
 				</div>

 				<div className="relative text-center mb-4 text-white z-10">
 					<div className="mx-auto mb-2">
 						<img 
 							src="/logo.jpg" // Da pasta /public
 							alt="Logo Salão Bela Vida" 
 							className="w-16 h-16 rounded-full shadow-lg mx-auto bg-white p-1"
 						/>
 					</div>
 					<h1 className="text-5xl md:text-6xl font-title mt-1" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>Salão Bela Vida</h1>
 					<p className="text-md md:text-lg opacity-95 tracking-wider">Beleza e cuidado em cada detalhe</p>
 				</div>

 				<SalonInfo />

 				<div className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 z-10 mt-4">
 					{isLoginView ? <LoginForm onLogin={onLogin} /> : <RegisterForm />}
 					<p className="text-center mt-6 text-sm text-gray-700">{isLoginView ? "Não tem uma conta?" : "Já tem uma conta?"}
 						<button onClick={() => setIsLoginView(!isLoginView)} className="font-semibold text-pink-600 hover:text-pink-800 hover:underline ml-1">{isLoginView ? "Cadastre-se" : "Faça login"}</button>
 					</p>
 				</div>
 			</div>
 		</>
 	);
}