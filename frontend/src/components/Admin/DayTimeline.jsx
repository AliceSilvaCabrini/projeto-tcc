// src/components/Admin/DayTimeline.jsx (COM MODAL DE DETALHES)

// 1. IMPORTAMOS O useState E O NOVO MODAL
import React, { useState } from 'react';
import AppointmentDetailModal from './AppointmentDetailModal.jsx';

export default function DayTimeline({ date, appointments }) {
 	// 2. ADICIONAMOS UM ESTADO PARA CONTROLAR O MODAL
 	const [selectedApt, setSelectedApt] = useState(null);

 	const startHour = 8;
 	const endHour = 20;
 	const totalHours = endHour - startHour;
 	const PIXELS_PER_MINUTE = 1.5;

 	const hours = Array.from({ length: totalHours }, (_, i) => i + startHour);

 	const getPositionAndHeight = (start, end) => {
 		const startDate = new Date(start);
 		const endDate = new Date(end);
 		const startOfDay = new Date(startDate);
 		startOfDay.setHours(startHour, 0, 0, 0);
 		const top = (startDate - startOfDay) / (1000 * 60) * PIXELS_PER_MINUTE;
 		const height = (endDate - startDate) / (1000 * 60) * PIXELS_PER_MINUTE;
 		return { top, height: Math.max(height, 20) };
 	}

 	const groupedAppointments = appointments.reduce((acc, apt) => {
 		const { top, height } = getPositionAndHeight(apt.data_hora_inicio, apt.data_hora_fim);
 		const bucket = Math.round(top); 
 		const key = String(bucket);
 		if (!acc[key]) {
 			acc[key] = { appointments: [], top: bucket, height: 0 };
 		}
 		acc[key].appointments.push(apt);
 		if (height > acc[key].height) acc[key].height = height;
 		return acc;
 	}, {});

 	const title = date.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit' });
 	const isClosedDay = date.getDay() === 0 || date.getDay() === 1;

 	return (
 		// 3. ENVOLVEMOS TUDO COM UM FRAGMENTO <>...</> (necessário para o modal)
 		<>
 			<div>
 				<h3 className={`text-lg font-bold mb-2 text-center ${isClosedDay ? 'text-red-500' : ''}`}>{title}</h3>
 				<div className="bg-gray-50 rounded-lg p-2 relative" style={{ height: (totalHours * 60 * PIXELS_PER_MINUTE) + 'px' }}>
 					{hours.map(hour => (
 						<div key={hour} className="relative border-t border-gray-200" style={{ height: `${60 * PIXELS_PER_MINUTE}px` }}>
 							<span className="absolute -top-3 left-0 bg-gray-50 px-1 text-xs text-gray-500">{`${String(hour).padStart(2, '0')}:00`}</span>
 						</div>
 					))}
 					{isClosedDay && (
 						<div className="absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-50">
 							<p className="font-semibold text-gray-500">Fechado</p>
 						</div>
 					)}

 					{Object.values(groupedAppointments).map((group, index) => (
 						<div
 							key={index}
 							className="absolute left-12 right-0 flex gap-1"
 							style={{ top: `${group.top}px` }}
 						>
 							{group.appointments.map(apt => {
 								const { height } = getPositionAndHeight(apt.data_hora_inicio, apt.data_hora_fim);
 								return (
 									<div
 										key={apt.id}
 										// 4. ADICIONAMOS O 'onClick' E 'cursor-pointer'
 										onClick={() => setSelectedApt(apt)}
 										className="flex-1 min-w-0 bg-pink-200 border-l-4 border-pink-500 p-2 rounded-lg overflow-hidden cursor-pointer hover:bg-pink-300"
 										style={{ height: `${height}px` }}
 									>
 										<p className="font-bold text-sm text-pink-800 truncate">{apt.servico_nome || 'Serviço Deletado'}</p>
 										<p className="text-xs text-pink-700">{apt.cliente_nome || ''} {apt.cliente_sobrenome || 'Cliente Deletado'}</p>
 										<p className="text-xs text-pink-700">Com: {apt.profissional_nome || 'Profissional Deletado'}</p>
 										{apt.observacao && (
 											<p className="text-xs text-pink-700 mt-1 italic truncate" title={apt.observacao}>
 												Obs: {apt.observacao}
 											</p>
 										)}
 									</div>
 								);
 							})}
 						</div>
 					))}
 				</div>
 			</div>

 			{/* 5. RENDERIZAMOS O MODAL QUANDO UM AGENDAMENTO FOR SELECIONADO */}
 			{selectedApt && (
 				<AppointmentDetailModal
 					appointment={selectedApt}
 					onClose={() => setSelectedApt(null)}
 				/>
 			)}
 		</>
 	);
}