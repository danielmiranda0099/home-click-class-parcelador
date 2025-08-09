-- CreateEnum
CREATE TYPE "ExpenseCategory" AS ENUM ('teacher', 'other');

-- AlterTable
ALTER TABLE "Debt" ADD COLUMN     "expenseCategory" "ExpenseCategory";

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "expenseCategory" "ExpenseCategory";
