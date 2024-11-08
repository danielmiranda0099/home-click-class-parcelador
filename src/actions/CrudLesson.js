"use server";
import prisma from "@/lib/prisma";
import { ResquestResponse } from "@/utils/requestResponse";
import {
  formatAndValidateStudents,
  validatePeriodOfTime,
  validateSchedule,
  validateSelectedDays,
  validateStartDate,
  validateStudents,
  validateTeacher,
  formatAndValidateteacher,
} from "@/utils/lessonCrudValidations";
import { scheduleLessons } from "@/utils/scheduleLessons";

const formattedLessonForBD = (form_data) => {
  // TODO Mirar como adtener los de mas datos del formulario
  const lesson_formated = Object.fromEntries(form_data.entries());
  if (lesson_formated.isGroup)
    lesson_formated.isGroup = Boolean(lesson_formated.isGroup);
  if (lesson_formated.isStudentPaid)
    lesson_formated.isStudentPaid = Boolean(
      parseInt(lesson_formated.isStudentPaid, 10)
    );
  if (lesson_formated.isTeacherPaid)
    lesson_formated.isTeacherPaid = Boolean(
      parseInt(lesson_formated.isTeacherPaid, 10)
    );
  if (lesson_formated.isRegistered)
    lesson_formated.isRegistered = Boolean(lesson_formated.isRegistered);
  if (lesson_formated.teacherPayment)
    lesson_formated.teacherPayment = parseFloat(lesson_formated.teacherPayment);
  if (lesson_formated.studentFee)
    lesson_formated.studentFee = parseFloat(lesson_formated.studentFee);
  console.log("Formated lesson***", lesson_formated);
  return lesson_formated;
};

export async function CreateNewLesson(prev_state, lessons_data) {
  try {
    const { students, teacher, periodOfTime, startDate, selectedDays, times } =
      lessons_data;

    const validations = [
      await validateStudents(students),
      await validateTeacher(teacher),
      await validatePeriodOfTime(periodOfTime),
      await validateStartDate(startDate),
      await validateSelectedDays(selectedDays),
      await validateSchedule(times, selectedDays),
    ];

    // Verificar si hay errores
    const validationError = validations.find((v) => !v.isValid);
    if (validationError) {
      return ResquestResponse.error(validationError.error);
    }

    // verificaciones de users y formating
    const students_formated = await formatAndValidateStudents(students);
    if (!students_formated.isValid) {
      return ResquestResponse.error(students_formated.error);
    }
    const { data: data_students } = students_formated;

    const teacher_formated = await formatAndValidateteacher(teacher);
    if (!students_formated.isValid) {
      return ResquestResponse.error(students_formated.error);
    }
    const { data: data_teacher } = teacher_formated;

    const all_date = scheduleLessons(
      selectedDays,
      times,
      periodOfTime,
      startDate
    );

    const lesson = {
      teacherId: data_teacher.teacherId,
      teacherPayment: data_teacher.teacherPayment,
    };

    const data = all_date.map((date) => ({
      ...lesson,
      isGroup: data_students.length > 1,
      startDate: date,
      studentLessons: {
        create: data_students,
      },
    }));

    const new_lessons = await prisma.$transaction(
      data.map((lesson_data) =>
        prisma.lesson.create({
          data: {
            ...lesson_data,
          },
          include: {
            teacher: true,
            studentLessons: {
              include: {
                student: true,
              },
            },
          },
        })
      )
    );
    console.log(JSON.stringify(new_lessons.slice(2), null, 2));
    return ResquestResponse.success(new_lessons);
  } catch (error) {
    console.error("Error Crating and Scheduling lessons:", error);
    return ResquestResponse.error();
  }
}

export async function getLessons() {
  try {
    // Obtener todas las lecciones
    const lessons = await prisma.lesson.findMany({
      include: {
        teacher: true, // Incluir información del profesor si es necesario
        studentLessons: {
          include: {
            student: true,
          },
        },
      },
      orderBy: {
        startDate: "asc", // Ordenar por startDate en orden ascendente (de más antigua a más nueva)
      },
    });

    if (!lessons) return [];
    console.log("Lessons", JSON.stringify(lessons.slice(1), null, 2));
    return lessons;
  } catch (error) {
    console.error("Error fetching lessons:", error);
    return [];
  }
}

export async function UpdateLesson(id, updated_lesson) {
  const updated_lesson_formated = formattedLessonForBD(updated_lesson);
  try {
    await prisma.lesson.update({
      where: {
        id,
      },
      data: updated_lesson_formated,
    });
  } catch (error) {
    console.log("Error Updating Lesson", error);
  }
}

export async function CancelLesson(id, value) {
  try {
    await prisma.lesson.update({
      where: {
        id,
      },
      data: {
        isCanceled: value,
      },
    });
  } catch (error) {
    console.error("error database", error);
  }
}

export async function RegisterLesson(id) {
  try {
    await prisma.lesson.update({
      where: {
        id,
      },
      data: {
        isRegistered: true,
      },
    });
  } catch (error) {
    console.error("error database", error);
  }
}

export async function ConfirmLesson(data_form) {
  try {
    const { id, lessonScore, studentObservations } = data_form;
    await prisma.lesson.update({
      where: {
        id,
      },
      data: {
        isConfirmed: true,
        lessonScore,
        studentObservations,
      },
    });
  } catch (error) {
    console.log("Error Confirming Lesson", error);
  }
}

//TODO ELIMINAR end_dates
export async function RescheduleLesson(data_form) {
  try {
    const { id, startDate } = data_form;
    await prisma.lesson.update({
      where: {
        id,
      },
      data: {
        startDate,
        isRescheduled: true,
      },
    });
  } catch (error) {
    console.error("Error Reschedule lessons:", error);
  }
}

export async function PayTeacherLesson(lessonIds) {
  try {
    await prisma.lesson.updateMany({
      where: {
        id: {
          in: lessonIds,
        },
      },
      data: {
        isTeacherPaid: true,
      },
    });
    console.log("Teacher payment confirmed");
  } catch (error) {
    console.error("Error confirming teacher payment:", error);
  }
}

export async function PayStudentLesson(studentLessonIds) {
  try {
    await prisma.studentLesson.updateMany({
      where: {
        id: {
          in: studentLessonIds,
        },
      },
      data: {
        isStudentPaid: true,
      },
    });
  } catch (error) {
    console.error("Error confirming student payment:", error);
  }
}

export async function UnpaidLessons(
  user_id,
  start_date,
  end_date,
  filters = {}
) {
  if (!user_id) return;
  try {
    const unpaid_lessons = await prisma.lesson.findMany({
      where: {
        OR: [
          {
            // Filtro para encontrar lecciones donde el estudiante no ha pagado
            studentLessons: {
              some: {
                isStudentPaid: false,
                student: {
                  id: user_id,
                },
              },
            },
          },
          {
            // Filtro para encontrar lecciones donde el profesor no ha sido pagado
            teacherId: user_id,
            isTeacherPaid: false,
          },
        ],
        startDate: {
          gte: start_date,
          lte: end_date,
        },
        isCanceled: false,
        ...filters,
      },
      include: {
        teacher: true, // Incluir información del profesor
        studentLessons: {
          include: {
            student: true, // Incluir información del estudiante en las lecciones
          },
        },
      },
      orderBy: {
        startDate: "asc", // Ordenar por startDate en orden ascendente (de más antigua a más nueva)
      },
    });
    return unpaid_lessons;
  } catch (error) {
    console.log("Error Getting Unpaid Lessons", error);
  }
}

export async function DeleteLesson(ids) {
  try {
    await prisma.lesson.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  } catch (error) {
    console.error("Error Unpaying Lesson", error);
  }
}
