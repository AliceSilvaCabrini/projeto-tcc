// frontend/src/components/Client/UserAppointmentList.jsx (VERSÃO LIMPA, SEM TOKEN MANUAL)
import React, { useState, useEffect } from 'react';
import api from '../../api';
import { toast } from 'react-toastify';
import ConfirmationModal from '../Admin/ConfirmationModal.jsx';

export default function UserAppointmentList() {
 	const [appointments, setAppointments] = useState([]);
 	const [loading, setLoading] = useState(true);
 	const [itemToCancel, setItemToCancel] = useState(null); 

 	const fetchAppointments = async () => {
 		setLoading(true);
 		try {
 			// NÃO PRECISA MAIS DO TOKEN AQUI!
 			const res = await api.get('/appointments');
 			setAppointments(res.data);
 		} catch (error) {
 			toast.error('Erro ao buscar seus agendamentos.');
 			console.error("Erro ao buscar agendamentos do usuário:", error);
 		} finally {
 			setLoading(false);
 		}
 	};

 	useEffect(() => {
 		fetchAppointments();
 	}, []);

 	const handleCancel = async () => {
 		if (!itemToCancel) return;
 		try {
 			// NÃO PRECISA MAIS DO TOKEN AQUI!
 			await api.delete(`/appointments/${itemToCancel}`);
 			toast.success('Agendamento cancelado com sucesso!');
 			setItemToCancel(null);
 			fetchAppointments(); 
 		} catch (error) {
 			toast.error('Erro ao cancelar o agendamento.');
 			console.error("Erro ao cancelar:", error);
 			setItemToCancel(null);
 		}
 	};

 	if (loading) {
 		return <p className="text-center text-gray-500">Buscando seus agendamentos...</p>;
 	}

 	return (
 		<>
 			<div className="space-y-4">
 				{appointments.length > 0 ? appointments.map(apt => (
 					<div key={apt.id} className="bg-white p-5 rounded-lg shadow-md flex justify-between items-start">
 						<div>
 							<p className="text-lg font-bold text-pink-600">{apt.servico_nome || 'Serviço Indisponível'}</p>
 							<p className="text-sm text-gray-700">Com: <span className="font-medium text-purple-600">{apt.profissional_nome || 'Profissional Indisponível'}</span></p>
 							<p className="text-md font-semibold text-gray-800 mt-1">
 								{new Date(apt.data_hora_inicio).toLocaleString('pt-BR', { dateStyle: 'full', timeStyle: 'short' })}
 							</p>
 							{apt.observacao && (
 								<p className="text-sm text-gray-500 italic mt-1">Sua observação: {apt.observacao}</p>
 							)}
 						</div>
 						<button 
 							onClick={() => setItemToCancel(apt.id)} 
 							className="text-sm font-semibold bg-red-100 text-red-700 px-4 py-2 rounded-full hover:bg-red-200"
 						>
 							Cancelar
 						</button>
 					</div>
 				)) : (
 					<div className="text-center text-gray-500 bg-white p-10 rounded-lg shadow">
 						<p>Você ainda não possui nenhum agendamento.</p>
 					</div>
 				)}
 			</div>

 			{itemToCancel && (
 				<ConfirmationModal
 					message="Tem certeza que deseja cancelar este agendamento?"
 					onConfirm={handleCancel}
 					onCancel={() => setItemToCancel(null)}
 				/>
 			)}
 		</>
 	);
}