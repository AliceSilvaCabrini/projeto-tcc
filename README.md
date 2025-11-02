# 💇‍♀️ PROJETO-TCC: Salão Bela Vida - Sistema de Agendamento

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Node.js](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![SQLite](https://img.shields.io/badge/sqlite-%2307405e.svg?style=for-the-badge&logo=sqlite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

O projeto consiste em um sistema web full-stack para o gerenciamento de um salão de beleza, permitindo o agendamento de horários e o gerenciamento completo de profissionais, serviços e clientes.

## 📝 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Como Executar](#-como-executar)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [Autora](#-autora)

## ✨ Sobre o Projeto

O **Salão Bela Vida** foi desenvolvido como uma solução completa para otimizar a gestão e o atendimento em salões de beleza. A plataforma permite que tanto os administradores quanto os clientes interajam com o sistema de forma intuitiva.

O sistema é uma **SPA (Single Page Application)** que possui duas interfaces principais: um **Painel Administrativo** para gerenciamento total do negócio, e um **Painel do Cliente** dedicado, onde o cliente pode gerenciar seus próprios agendamentos.

## 🚀 Funcionalidades

O sistema é dividido em dois tipos de acesso (Admin e Cliente), determinados via autenticação JWT baseada em `roles`.

- **Painel do Administrador (Admin):**
  - Login seguro para administradores.
  - **CRUD** (Criação, Leitura, Atualização e Deleção) de **Serviços**.
  - **CRUD** de **Profissionais**, com funcionalidade para vincular quais serviços cada profissional atende.
  - **CRUD** de **Clientes**, incluindo a capacidade de **excluir um cliente** (o que também apaga todos os agendamentos associados a ele, mantendo a integridade do banco).
  - **Agenda Visual (`Timeline`):** Uma visualização em formato de calendário que exibe todos os agendamentos do dia, com um modal para ver detalhes.
  - **Regras de Negócio:** O sistema impede a exclusão de Serviços ou Profissionais que possuam agendamentos futuros, protegendo a operação do salão.
  - Capacidade de criar novos clientes com uma senha padrão (`mudar123`).

- **Painel do Cliente (Cliente):**
  - Cadastro e Login de clientes.
  - **Painel do Cliente:** Uma tela "hub" onde o cliente pode navegar entre seus agendamentos ou criar um novo.
  - **Meus Agendamentos:** O cliente pode visualizar seus agendamentos futuros e passados.
  - **Cancelar Agendamento:** O cliente pode cancelar um agendamento futuro (com um modal de confirmação).
  - **Fluxo de Agendamento (Wizard):**
    - Etapa 1: Seleção do Serviço.
    - Etapa 2: Seleção do Profissional (o sistema filtra e mostra apenas os profissionais que atendem o serviço selecionado).
    - Etapa 3: **Algoritmo de Disponibilidade** que calcula e mostra apenas os horários livres, cruzando a duração do serviço, o horário de funcionamento do salão e a agenda do profissional em tempo real.
    - Etapa 4: Confirmação e finalização.
  - **Tratamento de Erros:** Notificações (`toast`) em tempo real informam o usuário sobre sucessos ou falhas.

## 🛠️ Tecnologias Utilizadas

O projeto foi construído utilizando tecnologias modernas e robustas do ecossistema JavaScript.

- **Front-end:**
  - [React](https://reactjs.org/) (com Hooks)
  - [Vite](https://vitejs.dev/) como bundler
  - [Axios](https://axios-http.com/) para requisições HTTP (com **Interceptors** para envio automático de token)
  - [TailwindCSS](https://tailwindcss.com/) para estilização utilitária e responsiva
  - [React Toastify](https://fkhadra.github.io/react-toastify/) para notificações

- **Back-end:**
  - [Node.js](https://nodejs.org/)
  - [Express](https://expressjs.com/) para o servidor API REST
  - [sqlite3](https://github.com/TryGhost/node-sqlite3) como driver do banco de dados
  - [Nodemon](https://nodemon.io/) para desenvolvimento em tempo real
  - [CORS](https://expressjs.com/en/resources/middleware/cors.html)
  - [bcrypt.js](https://github.com/kelektiv/node.bcrypt.js) para hash de senhas
  - [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) (JWT) para autenticação baseada em token

- **Banco de Dados:**
  - [SQLite](https://www.sqlite.org/index.html) (um banco de dados leve e baseado em arquivo)

## ⚙️ Como Executar

Para executar este projeto localmente, siga os passos abaixo.

### Pré-requisitos

- [Node.js](https://nodejs.org/en/) (versão 16 ou superior)
- [NPM](https://www.npmjs.com/) (geralmente instalado com o Node.js)
- [VS Code](https://code.visualstudio.com/) (Recomendado)

### Instalação

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/paolamayuri/projeto-tcc.git](https://github.com/paolamayuri/projeto-tcc.git)
    cd projeto-tcc
    ```

2.  **Instale o Back-end (API):**
    ```bash
    cd backend
    npm install
    ```
    
3.  **Configure as Variáveis de Ambiente (Backend):**
    - Na pasta `backend/`, você encontrará um arquivo chamado `.env.example`.
    - Crie uma cópia deste arquivo e renomeie-a para `.env`.
    - Abra o arquivo `.env` e substitua `uma_chave_segura_aqui` por qualquer senha ou frase secreta que você quiser.
    - (O arquivo `.env` já está no `.gitignore` e não será enviado ao GitHub).

4.  **Instale o Front-end:**
    ```bash
    cd ../frontend
    npm install
    ```

### Executando a Aplicação

Você precisará de **dois terminais** abertos.

1.  **Inicie o servidor Back-end:**
    - No primeiro terminal, navegue até a pasta `backend/` e execute:
    ```bash
    npm start
    ```
    - O servidor estará em execução em `http://localhost:3001`.
    - (O banco `salao.db` será criado e populado automaticamente na primeira vez).

2.  **Inicie o cliente Front-end:**
    - No **segundo** terminal, navegue até a pasta `frontend/` e execute:
    ```bash
    npm run dev
    ```
    - A aplicação estará acessível em `http://localhost:5173`.

**Login de Admin Padrão:**
* **Email:** `admin@salao.com`
* **Senha:** `admin123`

---
### 📦 Visualizando o Banco de Dados (Opcional)

Este projeto usa **SQLite**, que cria um arquivo de banco de dados chamado `salao.db` dentro da pasta `backend/`.

Para inspecionar esse banco de dados (ver as tabelas, clientes e agendamentos) diretamente no VS Code, eu recomendo instalar a extensão:

1.  Vá até a aba de Extensões (Ctrl+Shift+X).
2.  Procure por **"SQLite Viewer"** (de `Alexandre G. D. 'grss', 'grsn'`).
3.  Instale.
4.  Depois de instalar, clique com o botão direito no arquivo `backend/salao.db` e selecione **"Open Database"**.

---

## 📁 Estrutura de Pastas

O projeto está organizado em duas pastas principais (monorepo):

-   **`/backend`**: Contém todo o código do back-end (servidor Node.js/Express).
    -   `config/database.js`: Configuração e "seed" (população) do banco SQLite.
    -   `controllers/`: Lógica de controle para cada rota (regras de negócio).
    -   `middleware/`: Funções de segurança (`authenticateToken`, `authenticateAdmin`).
    -   `routes/`: Definição das rotas da API.
    -   `.env.example`: Arquivo de exemplo para as variáveis de ambiente.
    -   `salao.db`: O arquivo do banco de dados (criado automaticamente).
    -   `server.js`: O ponto de entrada que inicia o servidor.
-   **`/frontend`**: Contém todo o código do front-end (aplicação React).
    -   `public/`: Imagens estáticas (logos, fotos, etc.) que não expiram.
    -   `src/`: Pasta principal do código-fonte.
        -   `api/index.js`: Configuração central do Axios (com o Interceptor).
        -   `components/`: Blocos de "Lego" reutilizáveis (modais, listas, formulários).
        -   `screens/`: As telas principais da aplicação (`AuthScreen`, `AdminDashboard`, `ClientDashboard`).
        -   `App.jsx`: O roteador principal que decide qual tela mostrar.