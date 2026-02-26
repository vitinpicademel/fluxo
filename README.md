# Sistema Imobiliário - Fluxo Nominal de Vendas

Sistema completo para gestão de projetos imobiliários com separação estrita entre visão do usuário (incorporadora) e cálculos financeiros internos (admin).

## 🏗️ Estrutura do Projeto

```
planilh/
├── backend/                 # API Node.js + TypeScript + Prisma
│   ├── src/
│   │   ├── controllers/     # Controladores da API
│   │   ├── middleware/      # Middlewares de autenticação
│   │   ├── routes/          # Rotas da API
│   │   ├── services/        # Serviços de negócio
│   │   └── types/           # Tipos TypeScript
│   ├── prisma/
│   │   └── schema.prisma    # Schema do banco de dados
│   └── package.json
├── frontend/                # React + TypeScript + Tailwind
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   ├── pages/           # Páginas da aplicação
│   │   ├── services/        # Serviços de API
│   │   └── types/           # Tipos TypeScript
│   └── package.json
├── database.sql             # Schema SQL completo
└── README.md
```

## 🚀 Funcionalidades Principais

### 🔐 Sistema de Autenticação e RBAC
- **USER (Incorporadora)**: Acesso limitado ao próprio painel
- **ADMIN (Consultoria)**: Acesso completo a todos os dados financeiros

### 📊 Fluxo de Trabalho do Usuário (Incorporadora)

#### Etapa 1: Cadastro do Projeto
- Nome da empresa, CNPJ, responsável
- Localização e tipo do projeto
- Premissas gerais de vendas

#### Etapa 2: Premissas de Vendas
- Total de unidades e valor médio
- Duração da curva de vendas
- Distribuição mensal de unidades

### 💰 Cálculos Financeiros (Backend - Oculto)
- VGV Total = Valor Médio × Total Unidades
- Valor de Vendas Mensal
- Entradas (10%) e Parcelas (90%/36 meses)
- Projeção de Recebíveis
- Receita Total de Vendas

## 🛠️ Tecnologias

### Backend
- **Node.js** + **TypeScript**
- **Express.js** - Framework web
- **Prisma** - ORM e schema do banco
- **PostgreSQL** - Banco de dados
- **JWT** - Autenticação
- **bcryptjs** - Hash de senhas
- **Zod** - Validação de dados

### Frontend
- **React** + **TypeScript**
- **React Router** - Navegação
- **Tailwind CSS** - Estilização
- **React Hook Form** - Formulários
- **Axios** - Cliente HTTP
- **Lucide React** - Ícones

## 📋 Endpoints da API

### Autenticação
- `POST /api/auth/register` - Criar usuário
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Perfil do usuário

### Projetos (USER)
- `POST /api/projects` - Criar projeto
- `GET /api/projects/my-projects` - Meus projetos
- `POST /api/projects/:id/sales-data` - Submeter dados de vendas

### Admin (ADMIN)
- `GET /api/projects/admin/all` - Todos os projetos
- `GET /api/projects/admin/users` - Todos os usuários
- `GET /api/projects/admin/:id/financials` - Dados financeiros

## 🗄️ Estrutura do Banco de Dados

### Tabelas Principais
- **users**: Usuários e papéis (USER/ADMIN)
- **projects**: Dados dos projetos imobiliários
- **sales_data**: Curva de vendas mensal
- **financial_data**: Cálculos financeiros (apenas admin)
- **monthly_cash_flow**: Fluxo de caixa mensal

## 🔒 Segurança e Restrições

### Para Usuários (USER)
- ✅ Acesso apenas aos próprios projetos
- ❌ Nunca visualiza dados financeiros (receitas, despesas, margem)
- ✅ Feedback qualitativo apenas ("Projeto recebido para análise")

### Para Administradores (ADMIN)
- ✅ Acesso completo a todos os projetos
- ✅ Visualização de todos os cálculos financeiros
- ✅ Gestão de usuários e projetos

## 🚀 Instalação e Execução

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Configurar DATABASE_URL no .env
npm run prisma:migrate
npm run prisma:generate
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## 📝 Regras de Negócio

### Validações Importantes
- Total de unidades na curva deve bater com total do projeto
- CNPJ e email devem ser únicos
- Apenas ADMIN pode acessar dados financeiros
- Usuário só pode acessar próprios projetos

### Cálculos Automáticos
- VGV, receitas e fluxo de caixa calculados no backend
- Separação estrita entre frontend e backend
- Dados financeiros nunca expostos ao usuário final

## 🎯 Fluxo Completo

1. **Incorporadora** cria conta e faz login
2. **Cadastro do projeto** com dados da empresa
3. **Preenchimento das premissas** de vendas
4. **Submissão da curva** de vendas mensal
5. **Backend processa** cálculos financeiros
6. **Feedback qualitativo** para o usuário
7. **Admin acessa** dados completos no dashboard

---

**Nota**: Este sistema foi projetado com separação estrita entre visão do usuário e cálculos financeiros, garantindo confidencialidade dos dados comerciais enquanto proporciona uma experiência completa para as incorporadoras.
