// screens/AdminDashboard.jsx (COM LIMPEZA DE ESTADO)
import React, { useState, useEffect, useCallback } from 'react';
import api from '../api';
import { toast } from 'react-toastify';
import { PlusIcon } from '../components/Icons.jsx';

import AgendaTimelineView from '../components/Admin/AgendaTimelineView.jsx';
import AppointmentList from '../components/Admin/AppointmentList.jsx';
import ClientList from '../components/Admin/ClientList.jsx';
import ServiceManager from '../components/Admin/ServiceManager.jsx';
import ProfessionalManager from '../components/Admin/ProfessionalManager.jsx';
import ConfirmationModal from '../components/Admin/ConfirmationModal.jsx';
import ServiceModal from '../components/Admin/ServiceModal.jsx';
import ProfessionalModal from '../components/Admin/ProfessionalModal.jsx';
import UserEditModal from '../components/Admin/UserEditModal.jsx';
import AppointmentModal from '../components/Admin/AppointmentModal.jsx';
import AppointmentDetailModal from '../components/Admin/AppointmentDetailModal.jsx';

export default function AdminDashboard({ user, onLogout }) {
 	const [view, setView] = useState('agenda');
 	const [data, setData] = useState([]);
 	const [loading, setLoading] = useState(true);
 	
 	const [isConfirmOpen, setConfirmOpen] = useState(false);
 	const [isServiceModalOpen, setServiceModalOpen] = useState(false);
 	const [isProfessionalModalOpen, setProfessionalModalOpen] = useState(false);
 	const [isUserEditModalOpen, setUserEditModalOpen] = useState(false);
 	const [isAppointmentModalOpen, setAppointmentModalOpen] = useState(false);
 	
 	const [itemToProcess, setItemToProcess] = useState(null);
 	const [editingService, setEditingService] = useState(null);
 	const [editingProfessional, setEditingProfessional] = useState(null);
 	const [editingUser, setEditingUser] = useState(null);
    const [selectedAptDetail, setSelectedAptDetail] = useState(null);

 	const fetchData = useCallback(async () => {
 		setLoading(true);
 		// --- ESTA É A NOVA LINHA! ---
 		setData([]); // Limpa os dados antigos para evitar o bug de renderização
 		// --- FIM DA NOVA LINHA ---

 		let endpoint = '/admin/appointments';
 		if (view === 'clients') endpoint = '/admin/clients';
 		if (view === 'services') endpoint = '/services';
 		if (view === 'professionals') endpoint = '/professionals';
 		
 		try {
 			const response = await api.get(endpoint);
 			setData(response.data);
 		} catch (error) {
 			console.error(`Erro ao buscar dados para ${view}:`, error);
 			if (error.response?.status === 401 || error.response?.status === 403) {
 				toast.error("Sessão expirada. Faça login novamente.");
 				onLogout();
 			}
 			setData([]);
 		} finally {
 			setLoading(false);
 		}
 	}, [view, onLogout]); // O 'view' aqui garante que a função recarregue

 	useEffect(() => { fetchData(); }, [fetchData]);

 	const openDeleteConfirmation = (id, type) => {
 		setItemToProcess({ type, id });
 		setConfirmOpen(true);
 	};

 	const handleConfirmAction = async () => {
 		if (!itemToProcess) return;
 		const { type, id } = itemToProcess;
 		try {
 			let url = '';
 			if (type === 'appointment') url = `/appointments/${id}`;
 			else if (type === 'service') url = `/admin/services/${id}`;
 			else if (type === 'professional') url = `/admin/professionals/${id}`;
 			else if (type === 'client') url = `/admin/users/${id}`;
 			else return;
 			
 			await api.delete(url);
 			
 			toast.success(`Item excluído com sucesso!`);
 			fetchData();
 		} catch (error) {
 			const errorMessage = error.response?.data?.message || `Não foi possível excluir o item.`;
 			toast.error(errorMessage);
 		} finally {
 			setConfirmOpen(false);
 			setItemToProcess(null);
 		}
 	};

 	const handleOpenServiceModal = (service = null) => {
 		setEditingService(service);
 		setServiceModalOpen(true);
 	};
 	
 	const handleOpenProfessionalModal = (professional = null) => {
 		setEditingProfessional(professional);
 		setProfessionalModalOpen(true);
 	};
 	
 	const handleOpenUserEditModal = (userToEdit) => {
 		setEditingUser(userToEdit);
 		setUserEditModalOpen(true);
 	};

 	const renderContent = () => {
 		if (loading) return <p className="text-center">A carregar...</p>;

 		switch (view) {
 			case 'agenda':
 				return <AgendaTimelineView appointments={data} onSelectAppointment={setSelectedAptDetail} />;
 			case 'appointments':
 				return <AppointmentList appointments={data} onCancel={(id) => openDeleteConfirmation(id, 'appointment')} />;
 			case 'clients':
 				return <ClientList 
 					clients={data} 
 					onEdit={handleOpenUserEditModal} 
 					onDelete={(id) => openDeleteConfirmation(id, 'client')}
 				/>;
 			case 'services':
 				return <ServiceManager services={data} onEdit={handleOpenServiceModal} onDelete={(id) => openDeleteConfirmation(id, 'service')} />;
 			case 'professionals':
 				return <ProfessionalManager professionals={data} onEdit={handleOpenProfessionalModal} onDelete={(id) => openDeleteConfirmation(id, 'professional')} />;
 			default:
 				return <AgendaTimelineView appointments={data} onSelectAppointment={setSelectedAptDetail} />;
 		}
 	};

 	return (
 		<>
 			<div className="bg-gray-100 flex items-center justify-center min-h-screen">
 				<div className="w-full max-w-7xl mx-auto p-4">
 					<div className="bg-white rounded-xl shadow-lg overflow-hidden">
 						<header className="p-6 border-b flex justify-between items-center">
 							<div>
 								<h2 className="text-2xl font-bold">Painel do Administrador</h2>
 								<p className="text-gray-500">Bem-vindo, {user.nome}!</p>
 							</div>
 							<button onClick={onLogout} className="text-sm font-medium text-red-500">Sair</button>
 						</header>
 						
 						<nav className="p-4 border-b flex justify-between items-center bg-gray-50">
 							<div className="flex space-x-2 overflow-x-auto whitespace-nowrap py-2">
 								<button onClick={() => setView('agenda')} className={`px-4 py-2 rounded-lg text-sm font-semibold ${view === 'agenda' ? 'bg-pink-500 text-white' : 'bg-gray-200'}`}>Agenda</button>
 								<button onClick={() => setView('appointments')} className={`px-4 py-2 rounded-lg text-sm font-semibold ${view === 'appointments' ? 'bg-pink-500 text-white' : 'bg-gray-200'}`}>Agendamentos</button>
 								<button onClick={() => setView('clients')} className={`px-4 py-2 rounded-lg text-sm font-semibold ${view === 'clients' ? 'bg-pink-500 text-white' : 'bg-gray-200'}`}>Clientes</button>
 								<button onClick={() => setView('services')} className={`px-4 py-2 rounded-lg text-sm font-semibold ${view === 'services' ? 'bg-pink-500 text-white' : 'bg-gray-200'}`}>Serviços</button>
 								<button onClick={() => setView('professionals')} className={`px-4 py-2 rounded-lg text-sm font-semibold ${view === 'professionals' ? 'bg-pink-500 text-white' : 'bg-gray-200'}`}>Profissionais</button>
 							</div>
 							<div className="hidden md:flex"> 
 								{view === 'services' && <button onClick={() => handleOpenServiceModal()} className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-500 text-white hover:bg-blue-600 flex items-center"><PlusIcon />Novo Serviço</button>}
 								{view === 'professionals' && <button onClick={() => handleOpenProfessionalModal()} className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-500 text-white hover:bg-blue-600 flex items-center"><PlusIcon />Novo Profissional</button>}
 								{(view === 'agenda' || view === 'appointments') && <button onClick={() => setAppointmentModalOpen(true)} className="px-4 py-2 rounded-lg text-sm font-semibold bg-green-500 text-white hover:bg-green-600 flex items-center"><PlusIcon />Agendar para Cliente</button>}
 							</div>
 						</nav>
 
 						<main className="p-6 max-h-[65vh] overflow-y-auto">
 							{renderContent()}
 						</main>
 						
 						<div className="p-4 border-t bg-gray-50 md:hidden">
 							{view === 'services' && <button onClick={() => handleOpenServiceModal()} className="w-full px-4 py-3 rounded-lg text-sm font-semibold bg-blue-500 text-white hover:bg-blue-600 flex items-center justify-center"><PlusIcon />Novo Serviço</button>}
 							{view === 'professionals' && <button onClick={() => handleOpenProfessionalModal()} className="w-full px-4 py-3 rounded-lg text-sm font-semibold bg-blue-500 text-white hover:bg-blue-600 flex items-center justify-center"><PlusIcon />Novo Profissional</button>}
 							{(view === 'agenda' || view === 'appointments') && <button onClick={() => setAppointmentModalOpen(true)} className="w-full px-4 py-3 rounded-lg text-sm font-semibold bg-green-500 text-white hover:bg-green-600 flex items-center justify-center"><PlusIcon />Agendar para Cliente</button>}
 						</div>
 					</div>
 				</div>
 			</div>

 			{isConfirmOpen && <ConfirmationModal message={`Tem certeza que deseja apagar este ${itemToProcess.type}?`} onConfirm={handleConfirmAction} onCancel={() => setConfirmOpen(false)} />}
 			{isServiceModalOpen && <ServiceModal service={editingService} onClose={() => setServiceModalOpen(false)} onSave={fetchData} />}
 			{isProfessionalModalOpen && <ProfessionalModal professional={editingProfessional} onClose={() => setProfessionalModalOpen(false)} onSave={fetchData} />}
 			{isUserEditModalOpen && <UserEditModal userToEdit={editingUser} onClose={() => setUserEditModalOpen(false)} onSave={fetchData} />}
 			{isAppointmentModalOpen && <AppointmentModal onClose={() => setAppointmentModalOpen(false)} onAppointmentCreated={fetchData} />}
            {selectedAptDetail && (
                <AppointmentDetailModal
                    appointment={selectedAptDetail}
                    onClose={() => setSelectedAptDetail(null)}
                />
            )}
 		</>
 	);
}