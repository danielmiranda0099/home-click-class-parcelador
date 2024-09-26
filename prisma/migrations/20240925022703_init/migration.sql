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
    "role" "Role" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lesson" (
    "id" SERIAL NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "topic" TEXT,
    "teacherObservations" TEXT,
    "issues" TEXT,
    "isScheduled" BOOLEAN NOT NULL DEFAULT true,
    "isRescheduled" BOOLEAN NOT NULL DEFAULT false,
    "isCanceled" BOOLEAN NOT NULL DEFAULT false,
    "cancellationReason" TEXT,
    "isRegistered" BOOLEAN NOT NULL DEFAULT false,
    "isStudentPaid" BOOLEAN NOT NULL DEFAULT false,
    "isTeacherPaid" BOOLEAN NOT NULL DEFAULT false,
    "isConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "lessonScore" DOUBLE PRECISION,
    "studentObservations" TEXT,
    "teacherPayment" DOUBLE PRECISION,
    "studentFee" DOUBLE PRECISION,
    "profit" DOUBLE PRECISION,
    "week" TEXT,
    "otherObservations" TEXT,
    "studentId" INTEGER NOT NULL,
    "teacherId" INTEGER NOT NULL,

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
