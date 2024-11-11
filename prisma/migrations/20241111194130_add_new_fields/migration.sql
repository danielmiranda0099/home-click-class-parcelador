-- AlterTable
ALTER TABLE "StudentLesson" ADD COLUMN     "isConfirmed" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "fullName" TEXT,
ADD COLUMN     "shortName" TEXT;
