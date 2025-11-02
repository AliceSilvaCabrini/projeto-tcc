// src/components/Booking/SuccessStep.jsx (MODIFICADO)
import React from 'react';

// 1. A prop agora é 'onFinish'
export default function SuccessStep({ onFinish }) {
 	return (
 		<div className="text-center bg-white p-10 rounded-lg shadow-md">
 			<h2 className="text-2xl font-bold text-green-600 mb-4">Agendamento Confirmado!</h2>
 			<p className="text-gray-700 mb-6">O seu horário foi agendado com sucesso. Vemo-nos em breve!</p>
 			
 			{/* 2. O botão mudou */}
 			<button onClick={onFinish} className="bg-pink-500 text-white px-10 py-3 rounded-full font-semibold hover:bg-pink-600">
 				Ver Meus Agendamentos
 			</button>
 		</div>
 	);
}