export function getNamesStudentsFromLesson(student_lessons) {
  if (!student_lessons) return [];
  const names = student_lessons.map((lesson) => {
    const firstName = lesson.student.firstName.split(" ")[0];
    const lastName = lesson.student.lastName.split(" ")[0];
    return firstName + " " + lastName;
  });

  return names;
}

export function formatNamesForCalendar(names) {
  if (names.length === 1) {
    return names[0];
  }

  return names.map((name) => name.split(" ")[0]).join(", ");
}
