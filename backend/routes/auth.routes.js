// routes/auth.routes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

//definindo as rotas
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;