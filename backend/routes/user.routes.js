// routes/user.routes.js (COM ROTA DE DELETAR)
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
// Esta linha abaixo é a crucial
const { authenticateToken, authenticateAdmin } = require('../middleware/auth.middleware');

// A rota de PUT (Editar) que já existia
router.put('/users/:id', authenticateToken, userController.updateUser);

// --- NOVA ROTA ADICIONADA AQUI ---
// Apenas o Admin pode deletar usuários
router.delete('/admin/users/:id', authenticateAdmin, userController.deleteUser);

module.exports = router;