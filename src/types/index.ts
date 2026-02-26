import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export interface CreateUserDTO {
  email: string;
  password: string;
  name: string;
  role?: 'USER' | 'ADMIN';
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface ProjectDTO {
  companyName: string;
  cnpj: string;
  responsibleName: string;
  responsibleRole: string;
  corporateEmail: string;
  phone: string;
  city: string;
  state: string;
  projectType: 'VERTICAL' | 'HORIZONTAL' | 'MISTO';
  totalUnits: number;
  averageUnitValue: number;
  salesStartDate: string;
  salesDurationMonths: number;
}

export interface SalesDataDTO {
  month: number;
  year: number;
  unitsSold: number;
}

export interface FinancialCalculations {
  totalVGV: number;
  totalSalesRevenue: number;
  monthlyCashFlow: Array<{
    month: number;
    year: number;
    salesValue: number;
    entryValue: number;
    parcelValue: number;
    monthlyParcel: number;
    receivable: number;
  }>;
}
