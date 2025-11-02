// controllers/professional.controller.js (VERSÃO FINAL COM 2 QUERIES)
const db = require('../config/database');

// --- ESTA É A FUNÇÃO CORRETA ---
exports.getAllProfessionals = (req, res) => {
 	// 1. Primeiro, buscamos todos os profissionais
 	db.all(`SELECT * FROM profissionais ORDER BY nome`, [], (err, professionals) => {
 		if (err) {
 			console.error("Erro ao buscar profissionais:", err.message);
 			return res.status(500).json({ "error": err.message });
 		}
 		if (professionals.length === 0) {
 			return res.json([]);
 		}

 		// 2. Segundo, buscamos todas as associações de serviços
 		const sqlServicos = `
 			SELECT 
 				ps.id_profissional,
 				s.id,
 				s.nome
 			FROM profissional_servicos ps
 			LEFT JOIN servicos s ON ps.id_servico = s.id
 			WHERE s.nome IS NOT NULL 
 		`; // Adicionamos WHERE s.nome IS NOT NULL por segurança
 		
 		db.all(sqlServicos, [], (errServices, services) => {
 			if (errServices) {
 				console.error("Erro ao buscar serviços dos profissionais:", errServices.message);
 				return res.status(500).json({ "error": errServices.message });
 			}

 			// 3. Agora, combinamos os dois em JavaScript
 			const professionalsWithServices = professionals.map(prof => {
 				// Filtra a lista de serviços SÓ para este profissional
 				const servicosDoProfissional = services
 					.filter(s => s.id_profissional === prof.id)
 					.map(s => ({ id: s.id, nome: s.nome })); // Formata para o frontend
 				
 				return {
 					...prof,
 					servicos_oferecidos: servicosDoProfissional // O frontend espera esse nome!
 				};
 			});

 			res.json(professionalsWithServices);
 		});
 	});
};
// --- O RESTO DO ARQUIVO CONTINUA IGUAL ---

exports.createProfessional = (req, res) => {
 	const { nome, foto, servicosAtendidos } = req.body;
 	if (!nome) return res.status(400).json({ message: 'O nome é obrigatório.' });

 	db.run(`INSERT INTO profissionais (nome, foto) VALUES (?, ?)`, [nome, foto], function (err) {
 		if (err) {
 			return res.status(500).json({ message: 'Erro ao criar profissional.' });
 		}
 		const profissionalId = this.lastID;
 		if (servicosAtendidos && servicosAtendidos.length > 0) {
 			const stmt = db.prepare(`INSERT INTO profissional_servicos (id_profissional, id_servico) VALUES (?, ?)`);
 			servicosAtendidos.forEach(serviceId => stmt.run(profissionalId, serviceId));
 			stmt.finalize(() => res.status(201).json({ id: profissionalId, nome, foto, servicos_oferecidos: servicosAtendidos }));
 		} else {
 			res.status(201).json({ id: profissionalId, nome, foto, servicos_oferecidos: [] });
 		}
 	});
};

exports.updateProfessional = (req, res) => {
 	const { nome, foto, servicosAtendidos } = req.body;
 	const { id } = req.params;
 	if (!nome) return res.status(400).json({ message: 'O nome é obrigatório.' });

 	db.run(`UPDATE profissionais SET nome = ?, foto = ? WHERE id = ?`, [nome, foto, id], function (err) {
 		if (err) return res.status(500).json({ message: 'Erro ao atualizar profissional.' });

 		db.run(`DELETE FROM profissional_servicos WHERE id_profissional = ?`, [id], (deleteServicesErr) => {
 			if (deleteServicesErr) return res.status(500).json({ message: 'Erro ao atualizar associações de serviço.' });

 			if (servicosAtendidos && servicosAtendidos.length > 0) {
 				const stmt = db.prepare(`INSERT INTO profissional_servicos (id_profissional, id_servico) VALUES (?, ?)`);
 				servicosAtendidos.forEach(serviceId => stmt.run(id, serviceId));
 				stmt.finalize(() => res.json({ message: 'Profissional atualizado com sucesso.' }));
 			} else {
 				res.json({ message: 'Profissional atualizado com sucesso.' });
 			}
 		});
 	});
};

exports.deleteProfessional = (req, res) => {
 	const { id } = req.params;
 	const dataAtual = new Date().toISOString();

 	const sqlVerificacao = `SELECT COUNT(*) as count FROM agendamentos WHERE id_profissional = ? AND data_hora_inicio > ?`;

 	db.get(sqlVerificacao, [id, dataAtual], (err, row) => {
 		if (err) {
 			console.error("Erro ao verificar agendamentos futuros:", err.message);
 			return res.status(500).json({ message: "Erro interno ao verificar dependências." });
 		}

 		if (row.count > 0) {
 			return res.status(400).json({
 				message: `Este profissional não pode ser excluído, pois possui ${row.count} agendamento(s) futuro(s) associado(s) a ele.`
 			});
 		} else {
 			db.run(`DELETE FROM profissional_servicos WHERE id_profissional = ?`, id, (deleteServicesErr) => {
 				if (deleteServicesErr) {
 					console.error("Erro ao deletar associações de serviços do profissional:", deleteServicesErr.message);
 					return res.status(500).json({ message: 'Erro ao deletar associações de serviços do profissional.' });
 				}
 		
 				db.run(`DELETE FROM profissionais WHERE id = ?`, id, function(err) {
 					if (err) {
 						console.error("Erro ao deletar profissional:", err.message);
 						return res.status(500).json({ message: 'Erro ao deletar profissional.' });
 					}
 					if (this.changes === 0) {
 						return res.status(404).json({ message: 'Profissional não encontrado.' });
 					}
 					res.json({ message: 'Profissional deletado com sucesso.' });
 				});
 			});
 		}
 	});
};