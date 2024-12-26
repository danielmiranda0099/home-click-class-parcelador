import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

export function FormLessonReview({ lesson, rol }) {
  return (
    <>
      <div className="flex flex-wrap -mx-2 mb-4">
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
            required={rol === "teacher"}
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
