import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

export function FormLessonReview({ status, lesson }) {
  return (
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
          defaultValue={status !== "CREATE" ? lesson?.week || "" : ""}
          required
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
          defaultValue={status !== "CREATE" ? lesson?.topic || "" : ""}
        />
      </div>
      <div className="w-full sm:w-1/5 px-2 mb-4 sm:mb-0">
        <Label htmlFor="observation" className="block mb-1">
          Observation
        </Label>
        <Textarea
          name="teacher_observations"
          id="observation"
          className="h-32"
          placeholder="Enter observation..."
          defaultValue={
            status !== "CREATE" ? lesson?.teacher_observations || "" : ""
          }
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
          defaultValue={status !== "CREATE" ? lesson?.issues || "" : ""}
        />
      </div>
      <div className="w-full sm:w-1/5 px-2">
        <Label htmlFor="other" className="block mb-1">
          Other
        </Label>
        <Textarea
          name="other_observations"
          id="other"
          className="h-32"
          placeholder="Enter other information..."
          defaultValue={
            status !== "CREATE" ? lesson?.other_observations || "" : ""
          }
        />
      </div>
    </div>
  );
}
