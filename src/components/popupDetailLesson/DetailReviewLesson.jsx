import { Separator } from "@/components/ui/separator";
import { FeedbackIcon } from "@/components/icons";

export function DetailReviewLesson({ lesson, rol }) {
  if (lesson?.isConfirmed) {
    return (
      <>
        <Separator />
        <div className="flex items-start gap-4">
          <FeedbackIcon className="h-5 w-5 sm:h-8 sm:w-8 text-primary" />

          <p className="font-medium">Resumen de clase</p>
        </div>

        {rol === "admin" &&
          lesson?.isConfirmed &&
          lesson.studentLessons.map((lesson_student) => (
            <div
              className="grid grid-cols-3 sm:grid-cols-3"
              key={lesson_student.id}
            >
              {lesson.isGroup && lesson_student?.lessonScore && (
                <div className="flex items-center gap-4 w-full">
                  <FeedbackIcon
                    className="h-8 w-8 text-primary hidden sm:block"
                    color="white"
                  />

                  <p className="text-sm sm:text-base font-medium">{`${lesson_student.student.shortName}`}</p>
                </div>
              )}
              {lesson_student?.lessonScore && (
                <div className="flex items-start gap-4">
                  <FeedbackIcon
                    className="h-8 w-8 text-primary hidden sm:block"
                    color="white"
                  />

                  <div className="flex items-start gap-4">
                    {/* <RatingIcon size="1.5rem" className="text-primary" /> */}
                    <div>
                      <p className="text-sm sm:text-base font-medium">
                        Puntuación
                      </p>
                      <p className="text-muted-foreground">
                        {lesson_student?.lessonScore}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {lesson_student?.studentObservations && (
                <div className="flex items-start gap-4">
                  {/* <FeedbackIcon size="1.5rem" className="text-primary" /> */}
                  <div>
                    <p className="text-sm sm:text-base font-medium">Opinion</p>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      {lesson_student?.studentObservations}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        <Separator />
        <div className="flex gap-2 w-full">
          <div>
            <FeedbackIcon
              className="h-8 w-8 text-primary hidden sm:block"
              color="white"
            />
          </div>
          <div className="grid grid-cols-2 sm:grid-flow-col sm:auto-cols-fr gap-4 w-full">
            {lesson?.week && (
              <div className="flex items-start gap-4">
                <div>
                  <p className="text-sm sm:text-base font-medium">Week</p>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    {lesson?.week}
                  </p>
                </div>
              </div>
            )}
            {lesson?.topic && (
              <div className="flex items-start gap-4">
                <div>
                  <p className="text-sm sm:text-base font-medium">Topic</p>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    {lesson?.topic}
                  </p>
                </div>
              </div>
            )}

            {rol !== "student" && lesson?.teacherObservations && (
              <div className="flex items-start gap-4">
                <div>
                  <p className="text-sm sm:text-base font-medium">
                    Observations
                  </p>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    {lesson?.teacherObservations}
                  </p>
                </div>
              </div>
            )}

            {lesson?.issues && (
              <div className="flex items-start gap-4">
                <div>
                  <p className="text-sm sm:text-base font-medium">Por mejorar</p>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    {lesson?.issues}
                  </p>
                </div>
              </div>
            )}

            {lesson?.otherObservations && (
              <div className="flex items-start gap-4">
                <div>
                  <p className="text-sm sm:text-base font-medium">Others</p>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    {lesson?.otherObservations}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }
}
