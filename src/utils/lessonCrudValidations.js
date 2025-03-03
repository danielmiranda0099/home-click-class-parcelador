"use server";
import "server-only";
import prisma from "@/lib/prisma";
import { DAYS_OF_WEEK } from "@/utils/constans";
import { isValidDate } from "@/utils/dateValidator";
import { validateScheduleTimes } from "@/utils/validateScheduleTimes";

export async function validateStudents(students) {
  if (!students || students.length <= 0) {
    return {
      isValid: false,
      error: "Complete los campos del estudiante.",
    };
  }
  const hasInvalidStudent = students.some(
    (student) => !student.student || !student.fee
  );

  if (hasInvalidStudent) {
    return {
      isValid: false,
      error: "Complete los campos del estudiante.",
    };
  }

  return { isValid: true };
}
export async function validateTeacher(teacher) {
  if (!teacher.teacher || !teacher.payment) {
    return {
      isValid: false,
      error: "Complete los campos del profesor.",
    };
  }
  return { isValid: true };
}

export async function validatePeriodOfTime(periodOfTime) {
  if (!periodOfTime) {
    return {
      isValid: false,
      error: "Complete el campo de periodo de tiempo.",
    };
  }
  return { isValid: true };
}

export async function validateStartDate(startDate) {
  if (!startDate || !isValidDate(startDate)) {
    return {
      isValid: false,
      error: "Complete o verifique el campo de fecha de inicio.",
    };
  }
  return { isValid: true };
}

export async function validateSelectedDays(selectedDays) {
  if (
    selectedDays.length <= 0 ||
    !selectedDays.every((day) => DAYS_OF_WEEK.includes(day))
  ) {
    return {
      isValid: false,
      error: "Seleccione los dias y horas de agendamiento de las clases.",
    };
  }
  return { isValid: true };
}

export async function validateSchedule(times, selectedDays) {
  if (
    !validateScheduleTimes(times) ||
    !(selectedDays.length === Object.keys(times).length)
  ) {
    return {
      isValid: false,
      error: "Seleccione las horas de agendamiento.",
    };
  }
  return { isValid: true };
}

export async function validateDates(all_dates) {
  if(!all_dates) return { isValid: false, error: "Error en las fechas.",}
  all_dates.forEach((date, index) => {
    if (isNaN(Date.parse(date))) {
      return {
        isValid: false,
        error: "Error en las fechas.",
      };
    }
  });
  return { isValid: true };
}

export async function formatAndValidateStudents(students) {
  try {
    const formattedStudents = await Promise.all(
      students.map(async (data) => {
        // Validar existencia de usuario
        const user = await prisma.user.findFirst({
          where: {
            id: data.student.id,
          },
          select: {
            id: true,
            fullName: true,
            isActive: true,
          },
        });
        if (!user)
          throw new Error(
            "Por favor, verifique que los estudiantes están registrados."
          );
        if (!user.isActive)
          throw new Error(`El estudiente ${user?.fullName} no está activado.`);

        // Parsear y validar el monto
        let fee = data.fee;
        if (typeof fee !== "number") {
          fee = parseInt(fee.replace(/[^0-9]/g, ""), 10);
        }
        if (isNaN(fee) || fee <= 0) {
          throw new Error("Monto del estudiante inválido");
        }

        return {
          studentId: data.student.id,
          studentFee: fee,
        };
      })
    );

    // Validar que no se repita estudiantes
    const uniqueStudentIds = new Set(
      formattedStudents.map((item) => item.studentId)
    );
    if (uniqueStudentIds.size !== formattedStudents.length) {
      throw new Error("No se permite agregar un mismo estudiante dos veces.");
    }
    return {
      isValid: true,
      data: formattedStudents,
    };
  } catch (error) {
    return {
      isValid: false,
      error: error.message,
    };
  }
}

//TODO: Agregar verificacion si el teacher esta activo o no
export async function formatAndValidateteacher(teacher) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: teacher.teacher.id,
      },
      select: {
        id: true,
        fullName: true,
        isActive: true,
      },
    });
    if (!user) throw new Error("Por favor, verifique que el profesor esté registrado.");
    
    if (!user.isActive)
      throw new Error(`El profesor ${user?.fullName} no está activado.`);
    if (!teacher.payment)
      throw new Error("Por favor, ingrese un monto valido para el profesor.");
    let payment = teacher.payment;
    if (typeof payment !== "number") {
      payment = parseInt(payment.replace(/[^0-9]/g, ""), 10);
    }

    return {
      isValid: true,
      data: { teacherId: teacher.teacher.id, teacherPayment: payment },
    };
  } catch (error) {
    return {
      isValid: false,
      error: error.message,
    };
  }
}
