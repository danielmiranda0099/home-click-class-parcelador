/*
  Warnings:

  - You are about to drop the column `averageScore` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `isStudentPaid` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `studentFee` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `studentObservations` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `teacherObservations` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the `_StudentLessons` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_StudentLessons" DROP CONSTRAINT "_StudentLessons_A_fkey";

-- DropForeignKey
ALTER TABLE "_StudentLessons" DROP CONSTRAINT "_StudentLessons_B_fkey";

-- AlterTable
ALTER TABLE "Lesson" DROP COLUMN "averageScore",
DROP COLUMN "isStudentPaid",
DROP COLUMN "studentFee",
DROP COLUMN "studentObservations",
DROP COLUMN "teacherObservations";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "averageScore" DOUBLE PRECISION;

-- DropTable
DROP TABLE "_StudentLessons";

-- CreateTable
CREATE TABLE "StudentLesson" (
    "id" SERIAL NOT NULL,
    "isStudentPaid" BOOLEAN NOT NULL DEFAULT false,
    "studentObservations" TEXT,
    "studentFee" DOUBLE PRECISION,
    "teacherObservations" TEXT,
    "studentId" INTEGER NOT NULL,
    "lessonId" INTEGER NOT NULL,

    CONSTRAINT "StudentLesson_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StudentLesson_studentId_lessonId_key" ON "StudentLesson"("studentId", "lessonId");

-- AddForeignKey
ALTER TABLE "StudentLesson" ADD CONSTRAINT "StudentLesson_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentLesson" ADD CONSTRAINT "StudentLesson_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
