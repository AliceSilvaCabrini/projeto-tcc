// src/components/Booking/ConfirmationStep.jsx (VERSÃO SEM OBSERVAÇÃO)
import React from 'react';

export default function ConfirmationStep({ bookingDetails, onConfirm }) {
 	// O useState da 'observations' foi REMOVIDO
 	const { services, professional, dateTime } = bookingDetails;
 	const service = services[0];

 	return (
 		<div className="bg-white p-8 rounded-lg shadow-md max-w-lg mx-auto">
 			<h2 className="text-xl font-semibold mb-4 border-b pb-3">Resumo do Agendamento</h2>
 			<div className="space-y-4 text-gray-700">
 				<p><strong>Serviço:</strong> {service.nome} ({service.duracao} min)</p>
 				<p><strong>Profissional:</strong> {professional.nome}</p>
 				<p><strong>Data e Hora:</strong> {new Date(dateTime).toLocaleString('pt-BR', { dateStyle: 'full', timeStyle: 'short' })}</p>
 				
 				{/* O bloco <textarea> "Algum pedido especial?" FOI REMOVIDO DAQUI */}

 				<button 
 					// Agora ele chama onConfirm direto, passando null para a observação
 					onClick={() => onConfirm(null)} 
 					className="w-full bg-green-500 text-white px-10 py-3 rounded-full font-semibold hover:bg-green-600"
 				>
 					Confirmar Agendamento
 				</button>
 			</div>
 		</div>
 	);
}