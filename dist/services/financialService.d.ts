import { FinancialCalculations, SalesDataDTO } from '../types';
export declare class FinancialService {
    static calculateVGV(totalUnits: number, averageUnitValue: number): number;
    static calculateMonthlySalesValue(totalVGV: number, totalUnits: number, unitsSold: number): number;
    static calculatePaymentTerms(salesValue: number): {
        entryValue: number;
        parcelValue: number;
        monthlyParcel: number;
    };
    static calculateMonthlyReceivables(currentMonthEntry: number, currentMonthParcel: number, previousParcels: number[]): number;
    static generateFinancialProjections(projectId: string, totalUnits: number, averageUnitValue: number, salesData: SalesDataDTO[]): Promise<FinancialCalculations>;
    static saveFinancialData(projectId: string, calculations: FinancialCalculations): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        totalVGV: number;
        totalSalesRevenue: number;
        projectId: string;
        totalExpenses: number;
        grossMargin: number;
        grossMarginPercent: number;
        internalRateOfReturn: number | null;
        netPresentValue: number | null;
        paybackMonths: number | null;
    }>;
    static getProjectFinancials(projectId: string): Promise<({
        project: {
            status: string;
            companyName: string;
            responsibleName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        totalVGV: number;
        totalSalesRevenue: number;
        projectId: string;
        totalExpenses: number;
        grossMargin: number;
        grossMarginPercent: number;
        internalRateOfReturn: number | null;
        netPresentValue: number | null;
        paybackMonths: number | null;
    }) | null>;
    static getMonthlyCashFlow(projectId: string): Promise<{
        id: string;
        createdAt: Date;
        year: number;
        projectId: string;
        month: number;
        salesValue: number;
        entryValue: number;
        parcelValue: number;
        monthlyParcel: number;
        receivable: number;
    }[]>;
    static getAllProjectsFinancials(): Promise<({
        project: {
            status: string;
            id: string;
            createdAt: Date;
            user: {
                email: string;
                name: string;
            };
            companyName: string;
            responsibleName: string;
            city: string;
            state: string;
            projectType: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        totalVGV: number;
        totalSalesRevenue: number;
        projectId: string;
        totalExpenses: number;
        grossMargin: number;
        grossMarginPercent: number;
        internalRateOfReturn: number | null;
        netPresentValue: number | null;
        paybackMonths: number | null;
    })[]>;
}
//# sourceMappingURL=financialService.d.ts.map