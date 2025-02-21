import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { PlusIcon, XIcon } from "@/components/icons";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DAYS_OF_WEEK, DAYS_OF_WEEK_NUMBER } from "@/utils/constans";
import { ErrorAlert } from "@/components";
import { useCustomToast } from "@/hooks";
import { updateSchedule } from "@/actions/CrudShedule";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving.." : "Save"}
    </Button>
  );
}

export function FormWeeklySchedule({ userId, setIsOpen }) {
  const [schedule, setSchedule] = useState({
    0: [],
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
  });
  const [form_state, dispath] = useFormState(updateSchedule, {
    data: [],
    succes: null,
    error: false,
    message: null,
  });
  const [error_message, setErrorMessage] = useState("");
  const { toastSuccess } = useCustomToast();

  // Calcular máximo número de inputs en cualquier día
  const maxInputs = Math.max(
    ...Object.values(schedule).map((arr) => arr.length)
  );
  const handleAddTime = (day) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: [...prev[day], "12:00"],
    }));
  };

  const handleTimeChange = (day, index, newTime) => {
    setSchedule((prev) => {
      const updatedTimes = [...prev[day]];
      updatedTimes[index] = newTime;
      return { ...prev, [day]: updatedTimes };
    });
  };

  const handleRemoveTime = (day, index) => {
    setSchedule((prev) => {
      const updatedTimes = prev[day].filter((_, i) => i !== index);
      return { ...prev, [day]: updatedTimes };
    });
  };
  const onHandleShedule = () => {
    setErrorMessage("");
    console.log(schedule);
    const data = Object.entries(schedule).map(([day, times]) => ({
      day: parseInt(day),
      hours: times.map((time) => {
        return new Date(`1996-01-01T${time}:00`).toISOString();
      }),
    }));

    console.log("🚀 ~ data ~ data:", data);

    dispath({ userId: userId, scheduleData: data });
  };

  useEffect(() => {
    if (form_state?.success) {
      toastSuccess({ title: "Horario Actualizado." });
      setIsOpen(false);
    }
    if (form_state?.error) {
      setErrorMessage(form_state.message);
    } else {
      setErrorMessage("");
    }
  }, [form_state]);
  return (
    <form action={onHandleShedule}>
      <div className="space-y-4 min-h-[35vh]">
        <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
          {DAYS_OF_WEEK.map((day) => {
            const dayNumber = DAYS_OF_WEEK_NUMBER[day];
            const dayTimes = schedule[dayNumber];

            return (
              <div
                key={day}
                className={`flex flex-col items-center h-full ${
                  day !== "Do" && "border-r"
                }`}
              >
                <h2 className="bg-primary text-white rounded-full px-[0.7rem] py-[0.6rem] mb-4">
                  {day}
                </h2>
                <div className="flex flex-col items-center justify-between h-full w-full">
                  <div className="flex-1 flex flex-col items-center w-full px-1 gap-5">
                    {Array.from({ length: maxInputs }).map((_, index) => {
                      const time = dayTimes[index];

                      return time ? (
                        <div key={index} className="relative w-full">
                          <Input
                            type="time"
                            className="w-full border-gray-500 px-1 py-4"
                            value={time}
                            onChange={(e) =>
                              handleTimeChange(dayNumber, index, e.target.value)
                            }
                          />
                          <Button
                            className="h-7 w-7 absolute top-[-18px] left-[-12px] bg-white rounded-full shadow-xl border border-gray-300 p-2 cursor-pointer hover:bg-gray-200"
                            onClick={() => handleRemoveTime(dayNumber, index)}
                            type="button"
                          >
                            <XIcon className="h-7 w-7 text-black" />
                          </Button>
                        </div>
                      ) : (
                        <div
                          key={index}
                          className="w-full border-gray-500 px-1 py-2 text-gray-400 flex items-center justify-center"
                        >
                          -
                        </div>
                      );
                    })}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-3 w-fit"
                    type="button"
                    onClick={() => handleAddTime(dayNumber)}
                  >
                    <PlusIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <ErrorAlert message={error_message} />

      <DialogFooter>
        <div className="mt-6 space-x-4 flex justify-end">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <SubmitButton />
        </div>
      </DialogFooter>
    </form>
  );
}
