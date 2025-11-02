// controllers/user.controller.js (COM FUNÇÃO DE DELETAR)
const db = require('../config/database');

exports.updateUser = (req, res) => {
 	const { id } = req.params;
 	const { nome, sobrenome, telefone } = req.body;

 	if (parseInt(id) !== req.user.id && req.user.role !== 'admin') {
 		return res.status(403).json({ message: "Acesso negado." });
 	}
 	if (!nome) {
 		return res.status(400).json({ message: 'Nome é obrigatório.' });
 	}
 	db.run(`UPDATE usuarios SET nome = ?, sobrenome = ?, telefone = ? WHERE id = ?`,
 		[nome, sobrenome, telefone, id],
 		function (err) {
 			if (err) return res.status(500).json({ message: 'Erro ao atualizar dados do usuário.' });
 			if (this.changes === 0) return res.status(404).json({ message: 'Usuário não encontrado.' });
 			res.json({ message: 'Dados do usuário atualizados com sucesso.' });
 		});
};

// --- NOVA FUNÇÃO ADICIONADA AQUI ---
exports.deleteUser = (req, res) => {
 	const { id } = req.params;
 	const adminId = req.user.id;

 	// Proteção para não se auto-deletar
 	if (parseInt(id) === adminId) {
 		return res.status(400).json({ message: 'Você não pode excluir a si mesmo.' });
 	}
 	
 	// Usamos o db.serialize para garantir que os comandos rodem em ordem
 	db.serialize(() => {
 		// 1. Deleta os agendamentos do usuário
 		db.run(`DELETE FROM agendamentos WHERE id_usuario = ?`, [id], function (err) {
 			if (err) {
 				return res.status(500).json({ message: 'Erro ao deletar agendamentos do cliente.' });
 			}

 			// 2. Deleta o usuário (apenas se for 'cliente')
 			db.run(`DELETE FROM usuarios WHERE id = ? AND role = 'cliente'`, [id], function (err) {
 				if (err) {
 					return res.status(500).json({ message: 'Erro ao deletar cliente.' });
 				}
 				if (this.changes === 0) {
 					return res.status(404).json({ message: 'Cliente não encontrado ou não tem permissão.' });
 				}
 				res.json({ message: 'Cliente e todos os seus agendamentos foram excluídos com sucesso.' });
 			});
 		});
 	});
};