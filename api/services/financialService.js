const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

class FinancialService {
  static calculateVGV(totalUnits, averageUnitValue) {
    return totalUnits * averageUnitValue;
  }

  static calculateMonthlySalesValue(totalVGV, totalUnits, unitsSold) {
    return (totalVGV / totalUnits) * unitsSold;
  }

  static calculatePaymentTerms(salesValue) {
    const entryValue = salesValue * 0.10; // 10% de entrada
    const parcelValue = salesValue * 0.90; // 90% parcelado
    const monthlyParcel = parcelValue / 36; // Parcela mensal em 36 meses

    return {
      entryValue,
      parcelValue,
      monthlyParcel
    };
  }

  static calculateMonthlyReceivables(currentMonthEntry, currentMonthParcel, previousParcels) {
    const sumPreviousParcels = previousParcels.reduce((sum, parcel) => sum + parcel, 0);
    return currentMonthEntry + currentMonthParcel + sumPreviousParcels;
  }

  static async generateFinancialProjections(projectId, totalUnits, averageUnitValue, salesData) {
    const totalVGV = this.calculateVGV(totalUnits, averageUnitValue);
    
    const monthlyCashFlow = [];
    const allParcels = [];
    let totalSalesRevenue = 0;

    for (const sales of salesData) {
      const salesValue = this.calculateMonthlySalesValue(
        totalVGV, 
        totalUnits, 
        sales.unitsSold
      );

      const paymentTerms = this.calculatePaymentTerms(salesValue);
      
      allParcels.push(paymentTerms.monthlyParcel);

      const receivable = this.calculateMonthlyReceivables(
        paymentTerms.entryValue,
        paymentTerms.monthlyParcel,
        allParcels.slice(0, -1) // Todas as parcelas anteriores
      );

      totalSalesRevenue += receivable;

      monthlyCashFlow.push({
        month: sales.month,
        year: sales.year,
        salesValue,
        entryValue: paymentTerms.entryValue,
        parcelValue: paymentTerms.parcelValue,
        monthlyParcel: paymentTerms.monthlyParcel,
        receivable
      });
    }

    return {
      totalVGV,
      totalSalesRevenue,
      monthlyCashFlow
    };
  }

  static async saveFinancialData(projectId, calculations) {
    const { totalVGV, totalSalesRevenue, monthlyCashFlow } = calculations;

    // Salvar dados financeiros principais
    const financialData = await prisma.financialData.upsert({
      where: { projectId },
      update: {
        totalVGV,
        totalSalesRevenue,
        totalExpenses: 0,
        grossMargin: totalSalesRevenue,
        grossMarginPercent: totalSalesRevenue > 0 ? 100 : 0
      },
      create: {
        projectId,
        totalVGV,
        totalSalesRevenue,
        totalExpenses: 0,
        grossMargin: totalSalesRevenue,
        grossMarginPercent: totalSalesRevenue > 0 ? 100 : 0
      }
    });

    // Salvar fluxo de caixa mensal
    for (const cashFlow of monthlyCashFlow) {
      await prisma.monthlyCashFlow.upsert({
        where: {
          projectId_month_year: {
            projectId,
            month: cashFlow.month,
            year: cashFlow.year
          }
        },
        update: cashFlow,
        create: {
          projectId,
          ...cashFlow
        }
      });
    }

    return financialData;
  }

  static async getProjectFinancials(projectId) {
    return await prisma.financialData.findUnique({
      where: { projectId },
      include: {
        project: {
          select: {
            companyName: true,
            responsibleName: true,
            status: true
          }
        }
      }
    });
  }

  static async getMonthlyCashFlow(projectId) {
    return await prisma.monthlyCashFlow.findMany({
      where: { projectId },
      orderBy: [
        { year: 'asc' },
        { month: 'asc' }
      ]
    });
  }

  static async getAllProjectsFinancials() {
    return await prisma.financialData.findMany({
      include: {
        project: {
          select: {
            id: true,
            companyName: true,
            responsibleName: true,
            city: true,
            state: true,
            projectType: true,
            status: true,
            createdAt: true,
            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }
}

module.exports = {
  FinancialService
};
