import { Separator } from "@/components/ui/separator";
import { BookIcon, FeedbackIcon, RatingIcon, RescheduleIcon } from "../icons";

export function DetailReviewLesson({ lesson, rol }) {
  return (
    <>
      <Separator />
      <div className="flex items-start gap-4">
        <FeedbackIcon className="h-8 w-8 text-primary" />

        <p className="font-medium">Resumen de la clase</p>
      </div>

      <div className="grid grid-cols-2">
        {rol === "admin" && lesson?.is_confirmed && (
          <>
            {lesson?.lesson_score && (
              <div className="flex items-start gap-4">
                <FeedbackIcon className="h-8 w-8 text-primary" color="white" />

                <div className="flex items-start gap-4">
                  {/* <RatingIcon size="1.5rem" className="text-primary" /> */}
                  <div>
                    <p className="font-medium">Rating Class</p>
                    <p className="text-muted-foreground">
                      {lesson?.lesson_score}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {lesson?.student_observations && (
              <div className="flex items-start gap-4">
                {/* <FeedbackIcon size="1.5rem" className="text-primary" /> */}
                <div>
                  <p className="font-medium">Student Observations</p>
                  <p className="text-muted-foreground">
                    {lesson?.student_observations}
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <div className="grid grid-cols-2">
        {lesson?.week && (
          <div className="flex items-start gap-4">
            <FeedbackIcon className="h-8 w-8 text-primary" color="white" />
            {/* <BookIcon size="1.5rem" className="text-primary" /> */}
            <div>
              <p className="font-medium">Week</p>
              <p className="text-muted-foreground">{lesson?.week}</p>
            </div>
          </div>
        )}
        {lesson?.topic && (
          <div className="flex items-start gap-4">
            {/* <BookIcon size="1.5rem" className="text-primary" /> */}
            <div>
              <p className="font-medium">Topic</p>
              <p className="text-muted-foreground">{lesson?.topic}</p>
            </div>
          </div>
        )}

        {rol !== "student" && lesson?.teacher_observations && (
          <div className="flex items-start gap-4">
            <FeedbackIcon className="h-8 w-8 text-primary" color="white" />
            {/* <FeedbackIcon size="1.5rem" className="text-primary" /> */}
            <div>
              <p className="font-medium">Teacher Observations</p>
              <p className="text-muted-foreground">
                {lesson?.teacher_observations}
              </p>
            </div>
          </div>
        )}

        {lesson?.issues && (
          <div className="flex items-start gap-4">
            {rol === "student" && (
              <FeedbackIcon className="h-8 w-8 text-primary" color="white" />
            )}
            {/* <BookIcon size="1.5rem" className="text-primary" /> */}
            <div>
              <p className="font-medium">Problemas</p>
              <p className="text-muted-foreground">{lesson?.issues}</p>
            </div>
          </div>
        )}

        {lesson?.other_observations && (
          <div className="flex items-start gap-4">
            {rol !== "student" && (
              <FeedbackIcon className="h-8 w-8 text-primary" color="white" />
            )}

            {/* <BookIcon size="1.5rem" className="text-primary" /> */}
            <div>
              <p className="font-medium">Others</p>
              <p className="text-muted-foreground">
                {lesson?.other_observations}
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
