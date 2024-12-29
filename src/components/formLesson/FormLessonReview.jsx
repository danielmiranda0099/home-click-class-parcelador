import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

export function FormLessonReview({ lesson, rol }) {
  return (
    <>
      <div className="flex flex-wrap -mx-2 mb-4">
        {/* <div className="w-full mb-4">
          {lesson?.isConfirmed &&
            lesson.studentLessons.map((lesson_student) => (
              <div className="grid grid-cols-3" key={lesson_student.id}>
                {lesson.isGroup && lesson_student?.lessonScore && (
                  <div className="flex items-center gap-4 w-full">
                    {`${lesson_student.student.firstName.split(" ")[0]} ${lesson_student.student.lastName.split(" ")[0]}`}
                  </div>
                )}
                {lesson_student?.lessonScore && (
                  <div className="w-full px-2 mb-4 sm:mb-0">
                    <Label htmlFor="lesson-score" className="block mb-1">
                      Rating Class
                    </Label>
                    <Input
                      type="number"
                      id="lesson-score"
                      name="lesson_score"
                      min="1"
                      max="10"
                      defaultValue={
                        (lesson_student?.lessonScore).toString() || ""
                      }
                    />
                  </div>
                )}

                {lesson_student?.studentObservations && (
                  <div className="w-full px-2 mb-4 sm:mb-0">
                    <Label htmlFor="observations">Opinion</Label>
                    <Textarea
                      id="observations"
                      name="student_observations"
                      placeholder="Enter class Opinion"
                      defaultValue={lesson_student?.studentObservations || ""}
                    />
                  </div>
                )}
              </div>
            ))}
        </div> */}

        <div className="w-full sm:w-1/5 px-2 mb-4 sm:mb-0">
          <Label htmlFor="oriented-week" className="block mb-1">
            Oriented Week
          </Label>
          <Textarea
            id="oriented-week"
            name="week"
            className="h-32"
            placeholder="Enter oriented week..."
            defaultValue={lesson?.week || ""}
            required={lesson?.isRegistered}
          />
        </div>
        <div className="w-full sm:w-1/5 px-2 mb-4 sm:mb-0">
          <Label htmlFor="oriented-topic" className="block mb-1">
            Oriented Topic
          </Label>
          <Textarea
            name="topic"
            id="oriented-topic"
            className="h-32"
            placeholder="Enter oriented topic..."
            defaultValue={lesson?.topic || ""}
            required={lesson?.isRegistered}
          />
        </div>
        <div className="w-full sm:w-1/5 px-2 mb-4 sm:mb-0">
          <Label htmlFor="observation" className="block mb-1">
            Observation
          </Label>
          <Textarea
            name="teacherObservations"
            id="observation"
            className="h-32"
            placeholder="Enter observation..."
            defaultValue={lesson?.teacherObservations || ""}
            required={lesson?.isRegistered}
          />
        </div>
        <div className="w-full sm:w-1/5 px-2 mb-4 sm:mb-0">
          <Label htmlFor="issues" className="block mb-1">
            Issues
          </Label>
          <Textarea
            name="issues"
            id="issues"
            className="h-32"
            placeholder="Enter issues..."
            defaultValue={lesson?.issues || ""}
          />
        </div>
        <div className="w-full sm:w-1/5 px-2">
          <Label htmlFor="other" className="block mb-1">
            Other
          </Label>
          <Textarea
            name="otherObservations"
            id="other"
            className="h-32"
            placeholder="Enter other information..."
            defaultValue={lesson?.otherObservations || ""}
          />
        </div>
      </div>
    </>
  );
}
