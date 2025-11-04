// config/database.js (COM CAMINHOS LOCAIS DAS FOTOS)
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

const db = new sqlite3.Database('./salao.db', (err) => {
 	if (err) {
 		return console.error("Erro FATAL ao conectar ao banco de dados:", err.message);
 	}
 	console.log('Conectado ao banco de dados SQLite.');

 	db.serialize(() => {
 		// Tabela de Usuários
 		db.run(`CREATE TABLE IF NOT EXISTS usuarios (
 			id INTEGER PRIMARY KEY,
 			nome TEXT NOT NULL,
 			sobrenome TEXT,
 			email TEXT NOT NULL UNIQUE,
 			telefone TEXT,
 			senha TEXT NOT NULL,
 			role TEXT NOT NULL DEFAULT 'cliente'
 		)`);

 		// Tabela de Serviços
 		db.run(`CREATE TABLE IF NOT EXISTS servicos (
 			id INTEGER PRIMARY KEY,
 			nome TEXT NOT NULL,
 			duracao INTEGER NOT NULL,
 			preco REAL
 		)`);

 		// Tabela de Profissionais
 		db.run(`CREATE TABLE IF NOT EXISTS profissionais (
 			id INTEGER PRIMARY KEY,
 			nome TEXT NOT NULL,
 			foto TEXT DEFAULT 'https://placehold.co/150x150/cccccc/ffffff?text=Pro'
 		)`);

 		// Tabela para relacionar Profissionais e Serviços (muitos para muitos)
 		db.run(`CREATE TABLE IF NOT EXISTS profissional_servicos (
 			id_profissional INTEGER,
 			id_servico INTEGER,
 			PRIMARY KEY (id_profissional, id_servico),
 			FOREIGN KEY (id_profissional) REFERENCES profissionais(id) ON DELETE CASCADE,
 			FOREIGN KEY (id_servico) REFERENCES servicos(id) ON DELETE CASCADE
 		)`, (err) => {
 			if (err) console.error("Erro ao criar tabela profissional_servicos:", err.message);
 		});

 		// Tabela de Agendamentos
 		db.run(`CREATE TABLE IF NOT EXISTS agendamentos (
 			id INTEGER PRIMARY KEY,
 			id_usuario INTEGER,
 			id_servico INTEGER,
 			id_profissional INTEGER,
 			data_hora_inicio TEXT NOT NULL,
 			data_hora_fim TEXT NOT NULL,
 			observacao TEXT,
 			FOREIGN KEY(id_usuario) REFERENCES usuarios(id),
 			FOREIGN KEY(id_servico) REFERENCES servicos(id),
 			FOREIGN KEY(id_profissional) REFERENCES profissionais(id)
 		)`, (err) => {
 			if (err) return console.error("Erro ao criar tabela de agendamentos:", err.message);
 			seedInitialData(); // Chama a função de popular dados iniciais
 		});
 	});
});

// Função para popular dados iniciais
function seedInitialData() {
 	// Adicionar um usuário admin se não existir
 	db.get(`SELECT COUNT(*) as count FROM usuarios WHERE email = 'admin@salao.com'`, (err, row) => {
 		if (row.count === 0) {
 			bcrypt.hash('admin123', 10, (err, hash) => {
 				if (err) return console.error("Erro ao gerar hash da senha do admin:", err.message);
 				db.run(`INSERT INTO usuarios (nome, sobrenome, email, telefone, senha, role) VALUES (?, ?, ?, ?, ?, ?)`,
 					['Admin', 'Geral', 'admin@salao.com', 'XXYYYYZZZZZ', hash, 'admin'],
 					function (err) {
 						if (err) return console.error("Erro ao inserir admin:", err.message);
 						console.log('Usuário admin inserido.');
 					});
 			});
 		}
 	});

 	// Inserir serviços se a tabela estiver vazia
 	db.get(`SELECT COUNT(*) as count FROM servicos`, (err, row) => {
 		if (row.count === 0) {
 			const stmt = db.prepare(`INSERT INTO servicos (nome, duracao, preco) VALUES (?, ?, ?)`);
 			// --- MUDANÇA AQUI: "Corte Masculino" REMOVIDO ---
 			stmt.run('Corte Feminino', 60, 80.00);
 			stmt.run('Manicure', 45, 30.00);
 			stmt.run('Pedicure', 45, 35.00);
 			stmt.run('Coloração', 90, 120.00);
 			stmt.run('Escova', 40, 50.00);
 			stmt.finalize(() => {
 				console.log('Serviços iniciais inseridos.');
 				seedProfessionalsAndServices();
 			});
 		} else {
 			seedProfessionalsAndServices();
 		}
 	});
}

function seedProfessionalsAndServices() {
 	// Inserir profissionais se a tabela estiver vazia
 	db.get(`SELECT COUNT(*) as count FROM profissionais`, (err, row) => {
 		if (row.count === 0) {
 			const stmt = db.prepare(`INSERT INTO profissionais (nome, foto) VALUES (?, ?)`);
 			
 			// --- MUDANÇA AQUI ---
 			// Trocamos as URLs do Unsplash pelos caminhos locais
 			// Removemos "Bruno Costa" e adicionamos "Mariana"
 			stmt.run('Ana Silva', '/fotos/ana.jpg');
 			stmt.run('Carla Souza', '/fotos/carla.jpg');
 			stmt.run('Mariana', '/fotos/mariana.jpg');
 			// --- FIM DA MUDANÇA ---
 			
 			stmt.finalize(() => {
 				console.log('Profissionais iniciais inseridos.');
 				associateProfessionalServices();
 			});
 		} else {
 			associateProfessionalServices();
 		}
 	});
}

function associateProfessionalServices() {
 	db.run(`DELETE FROM profissional_servicos`, (err) => {
 		if (err) console.error("Erro ao limpar profissional_servicos:", err.message);

 		db.all(`SELECT id, nome FROM servicos`, (err, services) => {
 			if (err) return console.error("Erro ao buscar serviços para associação:", err.message);
 			db.all(`SELECT id, nome FROM profissionais`, (err, professionals) => {
 				if (err) return console.error("Erro ao buscar profissionais para associação:", err.message);

 				const getServiceId = (name) => services.find(s => s.nome === name)?.id;
 				const getProfessionalId = (name) => professionals.find(p => p.nome === name)?.id;

 				const stmt = db.prepare(`INSERT INTO profissional_servicos (id_profissional, id_servico) VALUES (?, ?)`);

 				// Ana Silva: Corte Feminino, Coloração, Escova
 				const anaId = getProfessionalId('Ana Silva');
 				if (anaId) {
 					const corteFemId = getServiceId('Corte Feminino');
 					const coloracaoId = getServiceId('Coloração');
 					const escovaId = getServiceId('Escova');
 					if (corteFemId) stmt.run(anaId, corteFemId);
 					if (coloracaoId) stmt.run(anaId, coloracaoId);
 					if (escovaId) stmt.run(anaId, escovaId);
 				}

 				// --- MUDANÇA AQUI: "Bruno Costa" REMOVIDO ---

 				// Carla Souza: Manicure, Pedicure
 				const carlaId = getProfessionalId('Carla Souza');
 				if (carlaId) {
 					const manicureId = getServiceId('Manicure');
 					const pedicureId = getServiceId('Pedicure');
 					if (manicureId) stmt.run(carlaId, manicureId);
 					if (pedicureId) stmt.run(carlaId, pedicureId);
 				}
 				
 				// (Você pode adicionar os serviços da Mariana aqui se quiser)
 				// const marianaId = getProfessionalId('Mariana');
 				// if (marianaId) { ... }
 				
 				stmt.finalize(() => console.log('Associações de serviços a profissionais concluídas.'));
 			});
 		});
 	});
}

module.exports = db;