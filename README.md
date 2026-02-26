# Sistema Imobiliário - Fluxo de Caixa Automatizado

Sistema completo para gestão de projetos imobiliários com fluxo de caixa automatizado que substitui planilhas Excel por uma interface moderna e profissional.

## 🎯 Funcionalidades Principais

### 🏢 Para Incorporadoras (USER)
- **Cadastro de projetos** completo com dados da empresa
- **Fluxo de caixa automatizado** que substitui planilhas
- **Cálculos automáticos** de VGV, margem e despesas
- **Interface visual profissional** com cards e tabelas
- **Dashboard personalizado** com estatísticas

### 🛡️ Para Administradores (ADMIN)
- **Visão geral** de todos os projetos e usuários
- **Acesso completo** aos dados financeiros
- **Gestão de incorporadoras** e projetos
- **Relatórios detalhados** do sistema

### 🚀 Sistema de Fluxo de Caixa
- **3 etapas intuitivas**: Dados básicos → Parâmetros → Resultados
- **Cálculos automáticos**: Curva de vendas, receitas, despesas
- **Visualização profissional**: Cards, tabelas, indicadores
- **Substituição completa** de planilhas Excel

## 🛠️ Tecnologias

### Backend
- **Node.js** + **TypeScript** + **Express**
- **Prisma ORM** + **SQLite** (banco de dados)
- **JWT** para autenticação
- **bcryptjs** para senhas
- **Zod** para validação

### Frontend
- **React** + **JavaScript**
- **React Router** para navegação
- **Tailwind CSS** para estilização
- **Lucide React** para ícones
- **Design moderno e responsivo**

## 📊 Estrutura do Projeto

```
planilh/
├── src/                     # Backend Node.js
│   ├── controllers/         # Lógica da API
│   ├── middleware/          # Autenticação e RBAC
│   ├── routes/              # Rotas da API
│   ├── services/            # Serviços financeiros
│   └── types/               # Tipos TypeScript
├── frontend/                # React Frontend
│   ├── src/
│   │   ├── components/      # Componentes reutilizáveis
│   │   ├── AdminDashboard.js # Painel admin
│   │   ├── Dashboard.js     # Dashboard usuário
│   │   ├── FluxoForm.js     # Formulário fluxo caixa
│   │   ├── ProjectForm.js   # Cadastro projetos
│   │   └── Login.js         # Autenticação
├── prisma/                  # Schema e migrations
└── README.md
```

## 🚀 Instalação e Execução

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Backend
```bash
# Instalar dependências
npm install

# Configurar ambiente
cp .env.example .env
# Editar .env com suas configurações

# Rodar migrations do banco
npx prisma migrate dev

# Iniciar servidor backend
npm run dev
# Servidor rodará em http://localhost:3001
```

### Frontend
```bash
# Entrar na pasta frontend
cd frontend

# Instalar dependências
npm install

# Iniciar servidor frontend
npm start
# Frontend rodará em http://localhost:3003
```

## � Acesso ao Sistema

### Usuário de Teste (Incorporadora)
- **Email**: `test@email.com`
- **Senha**: `123456`

### Administrador Master
- **Email**: `admin@imobiliario.com`
- **Senha**: `admin123`

## 📋 Funcionalidades Detalhadas

### 🏠 Fluxo de Caixa Automatizado
1. **Etapa 1 - Dados Básicos**:
   - Data de início das vendas
   - Quantidade total de unidades
   - Valor médio por unidade
   - Período de vendas (meses)

2. **Etapa 2 - Parâmetros Financeiros**:
   - Percentuais de entrada e parcelado
   - Configurações de despesas (ITBI, terreno, obra)
   - Taxas administrativas e comissões

3. **Etapa 3 - Resultados**:
   - VGV (Valor Geral de Vendas)
   - Despesas detalhadas
   - Margem bruta
   - Fluxo mensal completo

### 📊 Dashboard Incorporadora
- Cards com estatísticas (projetos, unidades, status)
- Lista de projetos com status
- Navegação intuitiva
- Design profissional

### 🛡️ Painel Administrativo
- Visão geral de todos os projetos
- Lista de incorporadoras cadastradas
- Estatísticas globais do sistema
- Acesso a dados financeiros completos

## 🔒 Segurança e Permissões

### USER (Incorporadora)
- ✅ Criar e gerenciar próprios projetos
- ✅ Acessar fluxo de caixa dos seus projetos
- ✅ Visualizar resultados dos cálculos
- ❌ Acessar dados de outros usuários

### ADMIN (Administrador)
- ✅ Acesso completo a todos os projetos
- ✅ Visualizar dados de todas as incorporadoras
- ✅ Gerenciar usuários do sistema
- ✅ Acesso a relatórios globais

## 🎯 Como Usar

1. **Criar conta** como incorporadora ou usar login de teste
2. **Cadastrar projeto** com dados da empresa
3. **Acessar Fluxo de Caixa** no menu lateral
4. **Preencher dados** básicos do projeto
5. **Ajustar parâmetros** financeiros se necessário
6. **Visualizar resultados** automáticos e profissionais

## 🔄 Substituição de Planilhas

O sistema substitui completamente planilhas Excel oferecendo:
- **Cálculos automáticos** e precisos
- **Interface visual** moderna e intuitiva
- **Validação de dados** em tempo real
- **Histórico** de projetos e simulações
- **Acesso colaborativo** para equipes

---

**GitHub**: https://github.com/vitinpicademel/fluxo  
**Status**: ✅ Produção Ready  
**Versão**: 1.0.0
