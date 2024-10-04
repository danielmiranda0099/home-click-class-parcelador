import { Separator } from "@/components/ui/separator";
import { FeedbackIcon } from "../icons";

export function DetailReviewLesson({ lesson, rol }) {
  return (
    <>
      <Separator />
      <div className="flex items-start gap-4">
        <FeedbackIcon className="h-8 w-8 text-primary" />

        <p className="font-medium">Resumen de la clase</p>
      </div>

      <div className="grid grid-cols-2">
        {rol === "admin" && lesson?.isConfirmed && (
          <>
            {lesson?.lessonScore && (
              <div className="flex items-start gap-4">
                <FeedbackIcon className="h-8 w-8 text-primary" color="white" />

                <div className="flex items-start gap-4">
                  {/* <RatingIcon size="1.5rem" className="text-primary" /> */}
                  <div>
                    <p className="font-medium">Rating Class</p>
                    <p className="text-muted-foreground">
                      {lesson?.lessonScore}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {lesson?.studentObservations && (
              <div className="flex items-start gap-4">
                {/* <FeedbackIcon size="1.5rem" className="text-primary" /> */}
                <div>
                  <p className="font-medium">Student Observations</p>
                  <p className="text-muted-foreground">
                    {lesson?.studentObservations}
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="flex gap-4 w-full">
        <div>
          <FeedbackIcon className="h-8 w-8 text-primary" color="white" />
        </div>
        <div className={`grid  grid-flow-col auto-cols-fr gap-4 w-full`}>
          {lesson?.week && (
            <div className="flex items-start gap-4">
              <div>
                <p className="font-medium">Week</p>
                <p className="text-muted-foreground">{lesson?.week}</p>
              </div>
            </div>
          )}
          {lesson?.topic && (
            <div className="flex items-start gap-4">
              <div>
                <p className="font-medium">Topic</p>
                <p className="text-muted-foreground">{lesson?.topic}</p>
              </div>
            </div>
          )}

          {rol !== "student" && lesson?.teacherObservations && (
            <div className="flex items-start gap-4">
              <div>
                <p className="font-medium">Observations</p>
                <p className="text-muted-foreground">
                  {lesson?.teacherObservations}
                </p>
              </div>
            </div>
          )}

          {lesson?.issues && (
            <div className="flex items-start gap-4">
              <div>
                <p className="font-medium">Problemas</p>
                <p className="text-muted-foreground">{lesson?.issues}</p>
              </div>
            </div>
          )}

          {lesson?.otherObservations && (
            <div className="flex items-start gap-4">
              <div>
                <p className="font-medium">Others</p>
                <p className="text-muted-foreground">
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
