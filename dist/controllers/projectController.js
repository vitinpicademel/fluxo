"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = exports.getProjectFinancials = exports.getAllProjects = exports.getProjectDetails = exports.getMyProjects = exports.submitSalesData = exports.createProject = void 0;
const client_1 = require("@prisma/client");
const financialService_1 = require("../services/financialService");
const zod_1 = require("zod");
const prisma = new client_1.PrismaClient();
const projectSchema = zod_1.z.object({
    companyName: zod_1.z.string().min(2, 'Nome da empresa é obrigatório'),
    cnpj: zod_1.z.string().min(14, 'CNPJ inválido'),
    responsibleName: zod_1.z.string().min(2, 'Nome do responsável é obrigatório'),
    responsibleRole: zod_1.z.string().min(2, 'Cargo do responsável é obrigatório'),
    corporateEmail: zod_1.z.string().email('Email corporativo inválido'),
    phone: zod_1.z.string().min(10, 'Telefone inválido'),
    city: zod_1.z.string().min(2, 'Cidade é obrigatória'),
    state: zod_1.z.string().min(2, 'Estado é obrigatório'),
    projectType: zod_1.z.enum(['VERTICAL', 'HORIZONTAL', 'MISTO']),
    totalUnits: zod_1.z.number().min(1, 'Total de unidades deve ser maior que 0'),
    averageUnitValue: zod_1.z.number().min(0, 'Valor médio por unidade deve ser maior que 0'),
    salesStartDate: zod_1.z.string().min(1, 'Data de início é obrigatória'),
    salesDurationMonths: zod_1.z.number().min(1, 'Duração deve ser maior que 0'),
});
const salesDataSchema = zod_1.z.object({
    salesData: zod_1.z.array(zod_1.z.object({
        month: zod_1.z.number().min(1).max(12),
        year: zod_1.z.number().min(2020).max(2030),
        unitsSold: zod_1.z.number().min(0)
    }))
});
const createProject = async (req, res) => {
    try {
        const validatedData = projectSchema.parse(req.body);
        const project = await prisma.project.create({
            data: {
                userId: req.user.id,
                companyName: validatedData.companyName,
                cnpj: validatedData.cnpj,
                responsibleName: validatedData.responsibleName,
                responsibleRole: validatedData.responsibleRole,
                corporateEmail: validatedData.corporateEmail,
                phone: validatedData.phone,
                city: validatedData.city,
                state: validatedData.state,
                projectType: validatedData.projectType,
                totalUnits: validatedData.totalUnits,
                averageUnitValue: validatedData.averageUnitValue,
                salesStartDate: new Date(validatedData.salesStartDate),
                salesDurationMonths: validatedData.salesDurationMonths,
            }
        });
        res.status(201).json({
            message: 'Projeto criado com sucesso',
            project: {
                id: project.id,
                companyName: project.companyName,
                status: project.status,
                createdAt: project.createdAt
            }
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                error: 'Dados inválidos',
                details: error.errors
            });
        }
        res.status(500).json({ error: 'Erro ao criar projeto' });
    }
};
exports.createProject = createProject;
const submitSalesData = async (req, res) => {
    try {
        const { projectId } = req.params;
        const validatedData = salesDataSchema.parse(req.body);
        // Verificar se o projeto pertence ao usuário
        const project = await prisma.project.findFirst({
            where: {
                id: projectId,
                userId: req.user.id
            }
        });
        if (!project) {
            return res.status(404).json({ error: 'Projeto não encontrado' });
        }
        // Validar se a soma das unidades vendidas bate com o total
        const totalUnitsSold = validatedData.salesData.reduce((sum, data) => sum + data.unitsSold, 0);
        if (totalUnitsSold !== project.totalUnits) {
            return res.status(400).json({
                error: `Total de unidades vendidas (${totalUnitsSold}) não bate com o total do projeto (${project.totalUnits})`
            });
        }
        // Salvar dados de vendas
        for (const salesData of validatedData.salesData) {
            await prisma.salesData.upsert({
                where: {
                    projectId_month_year: {
                        projectId,
                        month: salesData.month,
                        year: salesData.year
                    }
                },
                update: {
                    unitsSold: salesData.unitsSold
                },
                create: {
                    projectId,
                    month: salesData.month,
                    year: salesData.year,
                    unitsSold: salesData.unitsSold
                }
            });
        }
        // Gerar cálculos financeiros (apenas no backend)
        const calculations = await financialService_1.FinancialService.generateFinancialProjections(projectId, project.totalUnits, project.averageUnitValue, validatedData.salesData);
        // Salvar dados financeiros
        await financialService_1.FinancialService.saveFinancialData(projectId, calculations);
        // Atualizar status do projeto
        await prisma.project.update({
            where: { id: projectId },
            data: { status: 'APPROVED' }
        });
        // Retornar apenas feedback qualitativo para o usuário
        res.json({
            message: 'Projeto recebido para análise',
            status: 'Premissas validadas',
            details: 'Projeto elegível para análise financeira'
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                error: 'Dados inválidos',
                details: error.errors
            });
        }
        res.status(500).json({ error: 'Erro ao submeter dados de vendas' });
    }
};
exports.submitSalesData = submitSalesData;
const getMyProjects = async (req, res) => {
    try {
        const projects = await prisma.project.findMany({
            where: { userId: req.user.id },
            select: {
                id: true,
                companyName: true,
                city: true,
                state: true,
                projectType: true,
                totalUnits: true,
                averageUnitValue: true,
                salesStartDate: true,
                salesDurationMonths: true,
                status: true,
                createdAt: true,
                salesData: {
                    select: {
                        month: true,
                        year: true,
                        unitsSold: true
                    },
                    orderBy: [
                        { year: 'asc' },
                        { month: 'asc' }
                    ]
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        res.json(projects);
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao buscar projetos' });
    }
};
exports.getMyProjects = getMyProjects;
const getProjectDetails = async (req, res) => {
    try {
        const { projectId } = req.params;
        const project = await prisma.project.findFirst({
            where: {
                id: projectId,
                userId: req.user.id
            },
            select: {
                id: true,
                companyName: true,
                cnpj: true,
                responsibleName: true,
                responsibleRole: true,
                corporateEmail: true,
                phone: true,
                city: true,
                state: true,
                projectType: true,
                totalUnits: true,
                averageUnitValue: true,
                salesStartDate: true,
                salesDurationMonths: true,
                status: true,
                createdAt: true,
                salesData: {
                    select: {
                        month: true,
                        year: true,
                        unitsSold: true
                    },
                    orderBy: [
                        { year: 'asc' },
                        { month: 'asc' }
                    ]
                }
            }
        });
        if (!project) {
            return res.status(404).json({ error: 'Projeto não encontrado' });
        }
        res.json(project);
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao buscar detalhes do projeto' });
    }
};
exports.getProjectDetails = getProjectDetails;
// Endpoints exclusivos para ADMIN
const getAllProjects = async (req, res) => {
    try {
        const projects = await prisma.project.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                financialData: true,
                salesData: {
                    orderBy: [
                        { year: 'asc' },
                        { month: 'asc' }
                    ]
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        res.json(projects);
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao buscar todos os projetos' });
    }
};
exports.getAllProjects = getAllProjects;
const getProjectFinancials = async (req, res) => {
    try {
        const { projectId } = req.params;
        const financials = await financialService_1.FinancialService.getProjectFinancials(projectId);
        const cashFlow = await financialService_1.FinancialService.getMonthlyCashFlow(projectId);
        if (!financials) {
            return res.status(404).json({ error: 'Dados financeiros não encontrados' });
        }
        res.json({
            financials,
            cashFlow
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao buscar dados financeiros' });
    }
};
exports.getProjectFinancials = getProjectFinancials;
const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            where: { role: 'USER' },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                projects: {
                    select: {
                        id: true,
                        companyName: true,
                        status: true,
                        createdAt: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
};
exports.getAllUsers = getAllUsers;
//# sourceMappingURL=projectController.js.map