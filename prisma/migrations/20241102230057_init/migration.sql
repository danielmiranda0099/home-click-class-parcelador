-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'teacher', 'student');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "city" TEXT,
    "country" TEXT,
    "password" TEXT NOT NULL,
    "role" "Role"[],
    "averageScore" DOUBLE PRECISION,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lesson" (
    "id" SERIAL NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "topic" TEXT,
    "issues" TEXT,
    "week" TEXT,
    "teacherObservations" TEXT,
    "otherObservations" TEXT,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "isScheduled" BOOLEAN NOT NULL DEFAULT true,
    "isRescheduled" BOOLEAN NOT NULL DEFAULT false,
    "isCanceled" BOOLEAN NOT NULL DEFAULT false,
    "cancellationReason" TEXT,
    "isConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "isGroup" BOOLEAN NOT NULL DEFAULT false,
    "isRegistered" BOOLEAN NOT NULL DEFAULT false,
    "isTeacherPaid" BOOLEAN NOT NULL DEFAULT false,
    "teacherPayment" DOUBLE PRECISION,
    "reasonsRescheduled" TEXT,
    "profit" DOUBLE PRECISION,
    "teacherId" INTEGER NOT NULL,

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentLesson" (
    "id" SERIAL NOT NULL,
    "isStudentPaid" BOOLEAN NOT NULL DEFAULT false,
    "studentFee" DOUBLE PRECISION,
    "lessonScore" DOUBLE PRECISION,
    "studentObservations" TEXT,
    "studentId" INTEGER NOT NULL,
    "lessonId" INTEGER NOT NULL,

    CONSTRAINT "StudentLesson_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "StudentLesson_studentId_lessonId_key" ON "StudentLesson"("studentId", "lessonId");

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentLesson" ADD CONSTRAINT "StudentLesson_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentLesson" ADD CONSTRAINT "StudentLesson_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
