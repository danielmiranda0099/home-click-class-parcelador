/*
  Warnings:

  - You are about to drop the column `studentObservations` on the `StudentLesson` table. All the data in the column will be lost.
  - You are about to drop the column `teacherObservations` on the `StudentLesson` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "isPaid" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "studentObservations" TEXT,
ADD COLUMN     "teacherObservations" TEXT;

-- AlterTable
ALTER TABLE "StudentLesson" DROP COLUMN "studentObservations",
DROP COLUMN "teacherObservations";
