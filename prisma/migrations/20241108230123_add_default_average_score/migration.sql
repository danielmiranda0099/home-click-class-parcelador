/*
  Warnings:

  - Made the column `averageScore` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- Primero, actualizamos los registros existentes que tienen NULL en averageScore
UPDATE "User" SET "averageScore" = 10 WHERE "averageScore" IS NULL;
ALTER TABLE "User" ALTER COLUMN "averageScore" SET DEFAULT 10;
ALTER TABLE "User" ALTER COLUMN "averageScore" SET NOT NULL;