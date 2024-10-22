/*
  Warnings:

  - You are about to drop the column `lessonScore` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `studentObservations` on the `Lesson` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Lesson" DROP COLUMN "lessonScore",
DROP COLUMN "studentObservations";

-- AlterTable
ALTER TABLE "StudentLesson" ADD COLUMN     "lessonScore" DOUBLE PRECISION,
ADD COLUMN     "studentObservations" TEXT;
