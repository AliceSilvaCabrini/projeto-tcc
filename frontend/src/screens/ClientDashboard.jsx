// frontend/src/screens/ClientDashboard.jsx (CAMINHOS 100% CORRIGIDOS)
import React, { useState } from 'react';
import BookingProcess from './BookingProcess.jsx'; 
// CAMINHOS CORRIGIDOS: De 'src/screens' para 'src/components' é "../components/"
import UserAppointmentList from '../components/Client/UserAppointmentList.jsx'; 

export default function ClientDashboard({ user, onLogout }) {
 	const [view, setView] = useState('list'); 

 	return (
 		<div className="min-h-screen bg-gray-100 p-4 md:p-8">
 			<header className="flex justify-between items-center mb-8 max-w-5xl mx-auto">
 				<div>
 					<h1 className="text-2xl md:text-3xl font-bold text-gray-800">Olá, {user.nome}!</h1>
 					<p className="text-gray-500">Bem-vindo(a) ao seu painel.</p>
 				</div>
 				<button onClick={onLogout} className="text-sm font-medium text-red-500 hover:underline">Sair</button>
 			</header>

 			<main className="max-w-5xl mx-auto">
 				<div className="flex space-x-2 mb-6">
 					<button 
 						onClick={() => setView('list')} 
 						className={`px-5 py-2 rounded-full text-sm font-semibold ${view === 'list' ? 'bg-pink-500 text-white' : 'bg-white text-gray-700'}`}
 					>
 						Meus Agendamentos
 					</button>
 					<button 
 						onClick={() => setView('book')} 
 						className={`px-5 py-2 rounded-full text-sm font-semibold ${view === 'book' ? 'bg-pink-500 text-white' : 'bg-white text-gray-700'}`}
 					>
 						Novo Agendamento
 					</button>
 				</div>

 				<div>
 					{view === 'list' && (
 						<UserAppointmentList />
 					)}
 					
 					{view === 'book' && (
 						<BookingProcess 
 							user={user} 
 							onBookingSuccess={() => setView('list')} 
 						/>
 					)}
 				</div>
 			</main>
 		</div>
 	);
}