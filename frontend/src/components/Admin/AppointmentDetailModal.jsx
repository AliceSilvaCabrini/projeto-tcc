// frontend/src/components/Admin/AppointmentDetailModal.jsx
import React from 'react';

export default function AppointmentDetailModal({ appointment, onClose }) {
 	// Formata a data e hora de um jeito bonito
 	const dataFormatada = new Date(appointment.data_hora_inicio).toLocaleString('pt-BR', {
 		dateStyle: 'full',
 		timeStyle: 'short'
 	});

 	return (
 		<div 
 			className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-30"
 			onClick={onClose} // Fecha o modal se clicar fora
 		>
 			<div 
 				className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 space-y-4"
 				onClick={(e) => e.stopPropagation()} // Impede que o modal feche ao clicar dentro dele
 			>
 				{/* Título do Serviço */}
 				<h3 className="text-2xl font-bold text-pink-600 border-b pb-3">
 					{appointment.servico_nome || 'Serviço Deletado'}
 				</h3>
 				
 				{/* Detalhes do Agendamento */}
 				<div className="space-y-2">
 					<p className="text-gray-700">
 						<strong>Cliente:</strong> {appointment.cliente_nome || ''} {appointment.cliente_sobrenome || 'Cliente Deletado'}
 					</p>
 					<p className="text-gray-700">
 						<strong>Profissional:</strong> {appointment.profissional_nome || 'Profissional Deletado'}
 					</p>
 					<p className="text-gray-700">
 						<strong>Telefone:</strong> {appointment.cliente_telefone || 'Não informado'}
 					</p>
 					<p className="text-gray-700">
 						<strong>Horário:</strong> {dataFormatada}
 					</p>
 					{appointment.observacao && (
 						<p className="text-gray-700 pt-2 border-t mt-2">
 							<strong>Observação:</strong> <span className="italic">{appointment.observacao}</span>
 						</p>
 					)}
 				</div>
 				
 				{/* Botão de Fechar */}
 				<button 
 					onClick={onClose} 
 					className="w-full mt-4 px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300"
 				>
 					Fechar
 				</button>
 			</div>
 		</div>
 	);
}