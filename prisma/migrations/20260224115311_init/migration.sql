-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "companyName" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "responsibleName" TEXT NOT NULL,
    "responsibleRole" TEXT NOT NULL,
    "corporateEmail" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "projectType" TEXT NOT NULL,
    "totalUnits" INTEGER NOT NULL,
    "averageUnitValue" REAL NOT NULL,
    "salesStartDate" DATETIME NOT NULL,
    "salesDurationMonths" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    CONSTRAINT "projects_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "sales_data" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "unitsSold" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "sales_data_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "financial_data" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "totalVGV" REAL NOT NULL,
    "totalSalesRevenue" REAL NOT NULL,
    "totalExpenses" REAL NOT NULL,
    "grossMargin" REAL NOT NULL,
    "grossMarginPercent" REAL NOT NULL,
    "internalRateOfReturn" REAL,
    "netPresentValue" REAL,
    "paybackMonths" INTEGER,
    CONSTRAINT "financial_data_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "monthly_cash_flow" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "salesValue" REAL NOT NULL,
    "entryValue" REAL NOT NULL,
    "parcelValue" REAL NOT NULL,
    "monthlyParcel" REAL NOT NULL,
    "receivable" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "sales_data_projectId_month_year_key" ON "sales_data"("projectId", "month", "year");

-- CreateIndex
CREATE UNIQUE INDEX "financial_data_projectId_key" ON "financial_data"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "monthly_cash_flow_projectId_month_year_key" ON "monthly_cash_flow"("projectId", "month", "year");
