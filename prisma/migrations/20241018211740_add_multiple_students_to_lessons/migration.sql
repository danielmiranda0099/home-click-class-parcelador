/*
  Warnings:

  - You are about to drop the column `studentId` on the `Lesson` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Lesson" DROP CONSTRAINT "Lesson_studentId_fkey";

-- AlterTable
ALTER TABLE "Lesson" DROP COLUMN "studentId",
ADD COLUMN     "averageScore" DOUBLE PRECISION,
ADD COLUMN     "isGroup" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "reasonsRescheduled" TEXT;

-- CreateTable
CREATE TABLE "_StudentLessons" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_StudentLessons_AB_unique" ON "_StudentLessons"("A", "B");

-- CreateIndex
CREATE INDEX "_StudentLessons_B_index" ON "_StudentLessons"("B");

-- AddForeignKey
ALTER TABLE "_StudentLessons" ADD CONSTRAINT "_StudentLessons_A_fkey" FOREIGN KEY ("A") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StudentLessons" ADD CONSTRAINT "_StudentLessons_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
