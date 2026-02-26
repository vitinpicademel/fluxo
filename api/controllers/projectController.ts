import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest, ProjectDTO, SalesDataDTO } from '../types';
import { FinancialService } from '../services/financialService';
import { z } from 'zod';

const prisma = new PrismaClient();

const projectSchema = z.object({
  companyName: z.string().min(2, 'Nome da empresa é obrigatório'),
  cnpj: z.string().min(14, 'CNPJ inválido'),
  responsibleName: z.string().min(2, 'Nome do responsável é obrigatório'),
  responsibleRole: z.string().min(2, 'Cargo do responsável é obrigatório'),
  corporateEmail: z.string().email('Email corporativo inválido'),
  phone: z.string().min(10, 'Telefone inválido'),
  city: z.string().min(2, 'Cidade é obrigatória'),
  state: z.string().min(2, 'Estado é obrigatório'),
  projectType: z.enum(['VERTICAL', 'HORIZONTAL', 'MISTO']),
  totalUnits: z.number().min(1, 'Total de unidades deve ser maior que 0'),
  averageUnitValue: z.number().min(0, 'Valor médio por unidade deve ser maior que 0'),
  salesStartDate: z.string().min(1, 'Data de início é obrigatória'),
  salesDurationMonths: z.number().min(1, 'Duração deve ser maior que 0'),
});

const salesDataSchema = z.object({
  salesData: z.array(z.object({
    month: z.number().min(1).max(12),
    year: z.number().min(2020).max(2030),
    unitsSold: z.number().min(0)
  }))
});

export const createProject = async (req: AuthRequest, res: Response) => {
  try {
    const validatedData = projectSchema.parse(req.body) as ProjectDTO;
    
    const project = await prisma.project.create({
      data: {
        userId: req.user!.id,
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
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Dados inválidos', 
        details: error.errors 
      });
    }
    res.status(500).json({ error: 'Erro ao criar projeto' });
  }
};

export const submitSalesData = async (req: AuthRequest, res: Response) => {
  try {
    const { projectId } = req.params;
    const validatedData = salesDataSchema.parse(req.body);
    
    // Verificar se o projeto pertence ao usuário
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: req.user!.id
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
    const calculations = await FinancialService.generateFinancialProjections(
      projectId,
      project.totalUnits,
      project.averageUnitValue,
      validatedData.salesData
    );

    // Salvar dados financeiros
    await FinancialService.saveFinancialData(projectId, calculations);

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

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Dados inválidos', 
        details: error.errors 
      });
    }
    res.status(500).json({ error: 'Erro ao submeter dados de vendas' });
  }
};

export const getMyProjects = async (req: AuthRequest, res: Response) => {
  try {
    const projects = await prisma.project.findMany({
      where: { userId: req.user!.id },
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
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar projetos' });
  }
};

export const getProjectDetails = async (req: AuthRequest, res: Response) => {
  try {
    const { projectId } = req.params;
    
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: req.user!.id
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
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar detalhes do projeto' });
  }
};

// Endpoints exclusivos para ADMIN
export const getAllProjects = async (req: AuthRequest, res: Response) => {
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
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar todos os projetos' });
  }
};

export const getProjectFinancials = async (req: AuthRequest, res: Response) => {
  try {
    const { projectId } = req.params;
    
    const financials = await FinancialService.getProjectFinancials(projectId);
    const cashFlow = await FinancialService.getMonthlyCashFlow(projectId);

    if (!financials) {
      return res.status(404).json({ error: 'Dados financeiros não encontrados' });
    }

    res.json({
      financials,
      cashFlow
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar dados financeiros' });
  }
};

export const getAllUsers = async (req: AuthRequest, res: Response) => {
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
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
};
