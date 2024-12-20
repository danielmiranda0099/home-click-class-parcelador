"use client";

import { PopupFormTransaction } from "@/components/accounting";
import {
  HeaderAccountingHistory,
  MonthlyBreakdown,
  YearOverview,
} from "@/components/accountingHistory";
import { PopupDetailLesson } from "@/components/popupDetailLesson";
import { useUserSession } from "@/hooks";
import { useState } from "react";

export default function AccountingHistoryPage() {
  const [annual_and_monthly_balance, setAnnualAndMonthlyBalance] =
    useState(null);

  const [is_open_form_transaction, setIsOpenFormTransaction] = useState(false);

  const user_session = useUserSession();

  const onGetAnnualAndMonthlyBalance = (data) => {
    if (data.months && data.months.length > 0) {
      setAnnualAndMonthlyBalance(data);
    }
    if (annual_and_monthly_balance && data.months.length === 0) {
      setAnnualAndMonthlyBalance(null);
    }
  };

  return (
    <>
      <PopupDetailLesson
        rol={"admin"}
        user={user_session?.user}
        showFooter={false}
      />
      <PopupFormTransaction
        is_open={is_open_form_transaction}
        setIsOpen={setIsOpenFormTransaction}
        showButtonTrigger={false}
      />
      <div className="container mx-auto p-4 space-y-6">
        <HeaderAccountingHistory handleAction={onGetAnnualAndMonthlyBalance} />

        {annual_and_monthly_balance && (
          <>
            <YearOverview
              balance={annual_and_monthly_balance.balance}
              year={annual_and_monthly_balance.year}
            />

            <MonthlyBreakdown
              months={annual_and_monthly_balance.months}
              year={annual_and_monthly_balance.year}
              setIsOpenFormTransaction={setIsOpenFormTransaction}
            />
          </>
        )}
      </div>
    </>
  );
}
