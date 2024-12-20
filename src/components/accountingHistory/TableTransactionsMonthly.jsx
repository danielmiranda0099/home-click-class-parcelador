"use client";
import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { MONTHS_OF_YEAR } from "@/utils/constans";
import { getMonhtlyTransactions } from "@/actions/accounting";
import { ErrorAlert } from "@/components";
import {
  PopupFormTransaction,
  TableTransactions,
} from "@/components/accounting";

export function TableTransactionsMonthly({ month, year, idPrefix }) {
  const [monhtly_transactions, setMonhtlyTransactions] = useState(null);
  const { pending } = useFormStatus();
  const [form_state_form, dispathForm] = useFormState(getMonhtlyTransactions, {
    data: [],
    success: null,
    error: false,
    message: null,
  });
  const [error_message_form, setErrorMessageForm] = useState("");
  const [is_open_form_transaction, setIsOpenFormTransaction] = useState(false);

  useEffect(() => {
    if (form_state_form.success) {
      setMonhtlyTransactions(form_state_form.data);
    }
    if (form_state_form.error) {
      setErrorMessageForm(form_state_form.message);
    } else {
      setErrorMessageForm("");
    }
  }, [form_state_form]);

  const onGetTransactionsMonthly = () => {
    dispathForm({ month, year });
    setErrorMessageForm("");
  };
  return (
    <div>
      <PopupFormTransaction
        is_open={is_open_form_transaction}
        setIsOpen={setIsOpenFormTransaction}
        showButtonTrigger={false}
        handleAction={onGetTransactionsMonthly}
      />
      <form action={onGetTransactionsMonthly}>
        <Button
          variant="outline"
          type="submit"
          disabled={pending}
          className="mt-4"
        >
          Ver movimientos {MONTHS_OF_YEAR[month]} - {year}
        </Button>
        <div className="mb-6">
          <ErrorAlert message={error_message_form} className="max-w-96" />
        </div>
      </form>

      {monhtly_transactions && (
        <TableTransactions
          monhtly_transactions={monhtly_transactions}
          handleGetMonhtlyTransactions={onGetTransactionsMonthly}
          setIsOpenFormTransaction={setIsOpenFormTransaction}
          idPrefix={idPrefix}
          size="sm"
        />
      )}
    </div>
  );
}
