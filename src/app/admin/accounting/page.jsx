"use client";
import Link from "next/link";
import { getAllDebt, getMonhtlyTransactions } from "@/actions/accounting";
import { useEffect, useState } from "react";
import { getMonth, getYear } from "date-fns";
import { useUserSession } from "@/hooks";
import {
  CardsMontlyReport,
  PopupFormDebt,
  PopupFormTransaction,
  TableDebt,
  TableTransactions,
} from "@/components/accounting";
import { PopupDetailLesson } from "@/components/popupDetailLesson";

export default function AccountingPage() {
  const [monhtly_transactions, setMonhtlyTransactions] = useState(null);
  const [all_debts, setAllDebts] = useState(null);

  const user_session = useUserSession();

  const [is_open_form_transaction, setIsOpenFormTransaction] = useState(false);

  const [is_open_form_debt, setIsOpenFormDebt] = useState(false);

  const handleGetMonhtlyTransactions = async () => {
    const response_monhtly_transactions = await getMonhtlyTransactions(
      getMonth(new Date()) + 1, getYear(new Date())
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

  useEffect(() => {
    handleGetMonhtlyTransactions();
    handleGetAllDebt();
  }, []);

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
            href="/admin/accounting/history"
            className="pb-[0.08rem] border-b-2 border-gray-700 hover:text-blue-500 hover:border-blue-500 hover:bg-gray-200"
          >
            Ver todos los movimientos
          </Link>

          <PopupFormTransaction
            is_open={is_open_form_transaction}
            setIsOpen={setIsOpenFormTransaction}
            handleAction={handleGetMonhtlyTransactions}
          />
          <PopupFormDebt
            is_open={is_open_form_debt}
            setIsOpen={setIsOpenFormDebt}
            handleAction={handleGetAllDebt}
          />
        </div>

        <CardsMontlyReport monhtly_transactions={monhtly_transactions} />

        <div
          className="flex flex-col md:flex-row gap-3 mb-3 items-start
        "
        >
          <TableTransactions
            monhtly_transactions={monhtly_transactions}
            setIsOpenFormTransaction={setIsOpenFormTransaction}
            handleGetMonhtlyTransactions={handleGetMonhtlyTransactions}
          />

          <TableDebt debts={all_debts} handleGetAllDebt={handleGetAllDebt} setIsOpenFormDebt={setIsOpenFormDebt}/>
        </div>
      </main>
    </div>
  );
}
