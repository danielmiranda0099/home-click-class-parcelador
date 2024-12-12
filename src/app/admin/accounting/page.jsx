"use client";
import { useFormState } from "react-dom";

import Link from "next/link";
import {
  createNewDebts,
  createNewTransaction,
  getAllDebt,
  getMonhtlyTransactions,
} from "@/actions/accounting";
import { useEffect, useState } from "react";
import { getMonth } from "date-fns";
import { parseCurrencyToNumber } from "@/utils/parseCurrencyToNumber";
import { useCustomToast, useUserSession } from "@/hooks";
import {
  CardsMontlyReport,
  PopupFormCreateNewDebt,
  PopupFormCreateNewTransaction,
  TableDebt,
  TableTransactions,
} from "@/components/accounting";
import { PopupDetailLesson } from "@/components/popupDetailLesson";

export default function AccountingPage() {
  const [monhtly_transactions, setMonhtlyTransactions] = useState(null);
  const [all_debts, setAllDebts] = useState(null);

  const user_session = useUserSession();

  const [form_state_form_transaction, dispathFormTransaction] = useFormState(
    createNewTransaction,
    {
      data: [],
      success: null,
      error: false,
      message: null,
    }
  );
  const [
    error_message_form_new_transaction,
    setErrorMessageFormNewTransaction,
  ] = useState("");
  const [form_state_form_debt, dispathFormDebt] = useFormState(createNewDebts, {
    data: [],
    success: null,
    error: false,
    message: null,
  });
  const [error_message_form_new_Debt, setErrorMessageFormNewDebt] =
    useState("");

  const [is_open_form_new_transaction, setIsOpenFormNewTransaction] =
    useState(false);

  const [is_open_form_new_debt, setIsOpenFormNewDebt] = useState(false);

  const { toastSuccess } = useCustomToast();

  const handleGetMonhtlyTransactions = async () => {
    const response_monhtly_transactions = await getMonhtlyTransactions(
      getMonth(new Date()) + 1
    );
    if (response_monhtly_transactions.success) {
      setMonhtlyTransactions(response_monhtly_transactions.data);
    } else {
      setMonhtlyTransactions(null);
    }
  };

  const handleGetAllDebt = async () => {
    const response_all_debt = await getAllDebt();
    if (response_all_debt.success) {
      setAllDebts(response_all_debt.data);
    } else {
      setAllDebts(null);
    }
  };

  const onCreateNewTransaction = (form_data) => {
    const data = {
      date: form_data.get("date"),
      amount: parseCurrencyToNumber(form_data.get("amount")),
      type: form_data.get("type"),
      concept: form_data.get("concept"),
    };
    dispathFormTransaction(data);
    setErrorMessageFormNewTransaction("");
  };

  const onCreateNewDebt = (form_data) => {
    const data = {
      amount: parseCurrencyToNumber(form_data.get("amount")),
      type: form_data.get("type"),
      concept: form_data.get("concept"),
    };
    dispathFormDebt(data);
    setErrorMessageFormNewDebt("");
  };

  useEffect(() => {
    handleGetMonhtlyTransactions();
    handleGetAllDebt();
  }, []);

  useEffect(() => {
    if (form_state_form_transaction.success) {
      handleGetMonhtlyTransactions();
      toastSuccess({ title: "Movimiento creado exitosamente." });
      setIsOpenFormNewTransaction(false);
    }
    if (form_state_form_transaction.error) {
      setErrorMessageFormNewTransaction(form_state_form_transaction.message);
    } else {
      setErrorMessageFormNewTransaction("");
    }
  }, [form_state_form_transaction]);

  useEffect(() => {
    if (form_state_form_debt.success) {
      handleGetAllDebt();
      toastSuccess({ title: "Movimiento de cartera creado exitosamente." });
      setIsOpenFormNewDebt(false);
    }
    if (form_state_form_debt.error) {
      setErrorMessageFormNewDebt(form_state_form_debt.message);
    } else {
      setErrorMessageFormNewDebt("");
    }
  }, [form_state_form_debt]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <PopupDetailLesson
        rol={"admin"}
        user={user_session?.user}
        showFooter={false}
      />
      <main className="w-full flex-grow">
        <div className="w-full flex gap-3 mb-3 justify-end items-end">
          <Link
            href="#"
            className="pb-[0.08rem] border-b-2 border-gray-700 hover:text-blue-500 hover:border-blue-500 hover:bg-gray-200"
          >
            Ver todos los movimientos
          </Link>

          <PopupFormCreateNewTransaction
            is_open={is_open_form_new_transaction}
            setIsOpen={setIsOpenFormNewTransaction}
            onCreateNewTransaction={onCreateNewTransaction}
            error_message={error_message_form_new_transaction}
          />
          <PopupFormCreateNewDebt
            is_open={is_open_form_new_debt}
            setIsOpen={setIsOpenFormNewDebt}
            error_message={error_message_form_new_Debt}
            onCreateNewDebt={onCreateNewDebt}
          />
        </div>

        <CardsMontlyReport monhtly_transactions={monhtly_transactions} />

        <div
          className="flex flex-col md:flex-row gap-3 mb-3 items-start
        "
        >
          <TableTransactions monhtly_transactions={monhtly_transactions} />

          <TableDebt debts={all_debts} />
        </div>
      </main>
    </div>
  );
}
