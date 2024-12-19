"use client";
import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon } from "@/components/icons";
import { ErrorAlert } from "..";
import { getAnnualAndMonthlyBalance } from "@/actions/accounting";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className="flex gap-1 justify-center items-center"
    >
      <SearchIcon className="mr-2 h-4 w-4" />
      Search
    </Button>
  );
}

export function HeaderAccountingHistory({ handleAction = null }) {
  const [form_state_form_search_year, dispathFormSearchYear] = useFormState(
    getAnnualAndMonthlyBalance,
    {
      data: [],
      success: null,
      error: false,
      message: null,
    }
  );
  const [error_message_form_search_year, setErrorMessageFormSearchYear] =
    useState("");

  const onGetAnnualAndMonthlyBalance = (form_data) => {
    dispathFormSearchYear(form_data.get("year"));
    setErrorMessageFormSearchYear("");
  }

  useEffect(() => {
    if (form_state_form_search_year.success) {
      if (handleAction) {
        handleAction(form_state_form_search_year.data);
      }
    }
    if (form_state_form_search_year.error) {
      setErrorMessageFormSearchYear(form_state_form_search_year.message);
    } else {
      setErrorMessageFormSearchYear("");
    }
  }, [form_state_form_search_year]);

  return (
    <header className="flex flex-col items-between justify-center gap-3 mb-6">
      <h1 className="text-3xl font-bold">Contabilidad financiera</h1>
      <p className="lg:w-[60%]">
        Ingrese un año para comenzar y ver su historial de transacciones.
      </p>

      <form className="w-full max-w-sm space-y-2" action={onGetAnnualAndMonthlyBalance}>
        <div className="flex space-x-2">
          <Input
            id="year"
            name="year"
            type="number"
            min="2000"
            max="3000"
            className="w-32"
            required
          />
          <SubmitButton />
        </div>
        <div className="mb-6">
          <ErrorAlert message={error_message_form_search_year} />
        </div>
      </form>
    </header>
  );
}
