import prisma from "../lib/prisma.js";

(async () => {
  try {
    console.log("Updating startDate for all lessons...");
    
    // Obtén todas las lecciones
    const lessons = await prisma.lesson.findMany();

    // Actualiza cada lección sumando 5 horas al startDate
    for (const lesson of lessons) {
      const newStartDate = new Date(lesson.startDate);
      newStartDate.setHours(newStartDate.getHours() + 5);

      await prisma.lesson.update({
        where: { id: lesson.id },
        data: { startDate: newStartDate },
      });

      console.log(`Updated lesson ${lesson.id}: ${lesson.startDate} -> ${newStartDate}`);
    }

    console.log("All lessons updated successfully!");
  } catch (error) {
    console.error("Error updating startDate:", error);
  } finally {
    await prisma.$disconnect();
  }
})();
