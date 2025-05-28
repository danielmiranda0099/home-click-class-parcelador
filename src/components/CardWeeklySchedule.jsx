import { WeeklySchedule } from ".";
import { CalendarIcon } from "./icons";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

export default function CardWeeklySchedule({ userId }) {
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full sm:max-w-[35rem] mb-4"
    >
      <AccordionItem value="item-1">
        <AccordionTrigger className="w-full px-4">
          <div className="flex gap-2"> <h3 className="text-xl font-bold">Mi horario</h3> <CalendarIcon /></div>
        </AccordionTrigger>
        <AccordionContent>
          <WeeklySchedule userId={userId} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
