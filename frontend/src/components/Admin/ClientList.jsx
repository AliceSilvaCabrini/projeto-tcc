// src/components/Admin/ClientList.jsx (COM BOTÃO DELETAR)
import React from 'react';

// 1. Recebemos a nova função onDelete
export default function ClientList({ clients, onEdit, onDelete }) {
 	return (
 		<div className="space-y-3">
 			{clients.length > 0 ? clients.map(client => (
 				<div key={client.id} className="bg-gray-100 p-4 rounded-lg flex justify-between items-center">
 					<div>
 						<p className="font-bold">{client.nome} {client.sobrenome}</p>
 						<p className="text-sm text-gray-600">Email: {client.email}</p>
 						<p className="text-sm text-gray-600">Telefone: {client.telefone || 'Não informado'}</p>
 					</div>
 					
 					{/* 2. Adicionamos o novo botão */}
 					<div className="flex space-x-2">
 						<button onClick={() => onEdit(client)} className="text-xs font-semibold bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full hover:bg-yellow-300">Editar</button>
 						<button onClick={() => onDelete(client.id)} className="text-xs font-semibold bg-red-200 text-red-700 px-3 py-1 rounded-full hover:bg-red-300">Excluir</button>
 					</div>
 				</div>
 			)) : <p>Nenhum cliente encontrado.</p>}
 		</div>
 	);
}