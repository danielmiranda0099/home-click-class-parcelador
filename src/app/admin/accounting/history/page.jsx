"use client";

import {
  HeaderAccountingHistory,
  MonthlyBreakdown,
  YearOverview,
} from "@/components/accountingHistory";
import { useState } from "react";



export default function AccountingHistoryPage() {
  const [annual_and_monthly_balance, setAnnualAndMonthlyBalance] =
    useState(null);

  const onGetAnnualAndMonthlyBalance = (data) => {
    if (data.months && data.months.length > 0) {
      setAnnualAndMonthlyBalance(data);
    }
    if (annual_and_monthly_balance && data.months.length === 0) {
      setAnnualAndMonthlyBalance(null);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <HeaderAccountingHistory handleAction={onGetAnnualAndMonthlyBalance} />

      {annual_and_monthly_balance && (
        <>
          <YearOverview balance={annual_and_monthly_balance.balance} year={annual_and_monthly_balance.year}/>

          <MonthlyBreakdown months={annual_and_monthly_balance.months} year={annual_and_monthly_balance.year} />
        </>
      )}
    </div>
  );
}
