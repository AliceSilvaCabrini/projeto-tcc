// src/components/Admin/ServiceModal.jsx (VERSÃO LIMPA, SEM TOKEN MANUAL)
import React, { useState } from 'react';
import api from '../../api';
import { toast } from 'react-toastify'; 

export default function ServiceModal({ service, onClose, onSave }) {
 	const [nome, setNome] = useState(service?.nome || '');
 	const [duracao, setDuracao] = useState(service?.duracao || '');
 	const [preco, setPreco] = useState(service?.preco || '');
 	
 	const handleSubmit = async (e) => {
 		e.preventDefault();
 		
 		if (!nome || !duracao || preco === '') {
 			toast.error('Todos os campos são obrigatórios.');
 			return;
 		}

 		// NÃO PRECISA MAIS DO TOKEN AQUI!
 		const payload = { nome, duracao: parseInt(duracao, 10), preco: parseFloat(preco) };

 		try {
 			if (service) { 
 				await api.put(`/admin/services/${service.id}`, payload);
 			} else { 
 				await api.post('/admin/services', payload);
 			}
 			
 			toast.success('Serviço salvo com sucesso!');
 			
 			onSave(); 
 			onClose();
 		} catch (err) {
 			const errorMessage = err.response?.data?.message || 'Erro ao salvar o serviço.';
 			toast.error(errorMessage);
 		}
 	};

 	return (
 		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-20">
 			<div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
 				<form onSubmit={handleSubmit}>
 					<div className="p-6 border-b"><h3 className="text-xl font-bold">{service ? 'Editar Serviço' : 'Novo Serviço'}</h3></div>
 					<div className="p-6 space-y-4">
 						<div>
 							<label className="block text-sm font-medium mb-1">Nome do Serviço</label>
 							<input type="text" value={nome} onChange={e => setNome(e.target.value)} className="w-full px-4 py-2 border rounded-lg" required />
 						</div>
 						<div>
 							<label className="block text-sm font-medium mb-1">Duração (em minutos)</label>
 							<input type="number" value={duracao} onChange={e => setDuracao(e.target.value)} className="w-full px-4 py-2 border rounded-lg" required />
 						</div>
 						<div>
 							<label className="block text-sm font-medium mb-1">Preço (R$)</label>
 							<input type="number" step="0.01" value={preco} onChange={e => setPreco(e.target.value)} className="w-full px-4 py-2 border rounded-lg" required />
 						</div>
 					</div>
 					<div className="p-4 bg-gray-50 flex justify-end space-x-3">
 						<button type="button" onClick={onClose} className="px-6 py-2 bg-gray-200 rounded-lg">Cancelar</button>
 						<button type="submit" className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Salvar</button>
 					</div>
 				</form>
 			</div>
 		</div>
 	);
}