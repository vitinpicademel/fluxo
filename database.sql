-- Schema SQL para o Sistema Imobiliário
-- Baseado no schema Prisma acima

-- Criar extensão para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum para UserRole
CREATE TYPE user_role AS ENUM ('USER', 'ADMIN');

-- Enum para ProjectType  
CREATE TYPE project_type AS ENUM ('VERTICAL', 'HORIZONTAL', 'MISTO');

-- Tabela de Usuários
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'USER',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Projetos
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Dados da empresa/incorporadora
    company_name VARCHAR(255) NOT NULL,
    cnpj VARCHAR(20) NOT NULL,
    responsible_name VARCHAR(255) NOT NULL,
    responsible_role VARCHAR(100) NOT NULL,
    corporate_email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    project_type project_type NOT NULL,
    
    -- Premissas gerais de vendas
    total_units INTEGER NOT NULL,
    average_unit_value DECIMAL(15,2) NOT NULL,
    sales_start_date DATE NOT NULL,
    sales_duration_months INTEGER NOT NULL,
    
    -- Status do projeto
    status VARCHAR(50) DEFAULT 'PENDING'
);

-- Tabela de Dados de Vendas (Curva de Vendas)
CREATE TABLE sales_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    month INTEGER NOT NULL,
    year INTEGER NOT NULL,
    units_sold INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(project_id, month, year)
);

-- Tabela de Dados Financeiros (apenas para ADMIN)
CREATE TABLE financial_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID UNIQUE NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Cálculos financeiros
    total_vgv DECIMAL(15,2) NOT NULL,
    total_sales_revenue DECIMAL(15,2) NOT NULL,
    total_expenses DECIMAL(15,2) DEFAULT 0,
    gross_margin DECIMAL(15,2) NOT NULL,
    gross_margin_percent DECIMAL(5,2) NOT NULL,
    
    -- Métricas financeiras avançadas
    internal_rate_of_return DECIMAL(8,4),
    net_present_value DECIMAL(15,2),
    payback_months INTEGER
);

-- Tabela de Fluxo de Caixa Mensal
CREATE TABLE monthly_cash_flow (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    month INTEGER NOT NULL,
    year INTEGER NOT NULL,
    sales_value DECIMAL(15,2) NOT NULL,
    entry_value DECIMAL(15,2) NOT NULL,
    parcel_value DECIMAL(15,2) NOT NULL,
    monthly_parcel DECIMAL(15,2) NOT NULL,
    receivable DECIMAL(15,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(project_id, month, year)
);

-- Índices para performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_sales_data_project_id ON sales_data(project_id);
CREATE INDEX idx_financial_data_project_id ON financial_data(project_id);
CREATE INDEX idx_monthly_cash_flow_project_id ON monthly_cash_flow(project_id);

-- Triggers para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_financial_data_updated_at BEFORE UPDATE ON financial_data
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Inserir usuário ADMIN padrão (senha: admin123)
INSERT INTO users (id, email, password, name, role) 
VALUES (
    uuid_generate_v4(),
    'admin@sistema.com',
    '$2b$10$rQZ8gHWXGX4kXQdQw8S.KOqPY8v6XM1WgJ5EPd4jE9Q8gHWXGX4kX',
    'Administrador do Sistema',
    'ADMIN'
);
