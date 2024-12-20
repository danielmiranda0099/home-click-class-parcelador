"use server";
import prisma from "@/lib/prisma";
import { RequestResponse } from "@/utils/requestResponse";
import { getMonth, getWeek, getYear, parse } from "date-fns";

export async function createNewTransaction(prev, form_dada) {
  try {
    const { date, amount, type, concept, userId, lessonId } = form_dada;

    if (!date || !amount || !type) {
      return RequestResponse.error(
        "Por favor rellene los campos obligatorios."
      );
    }

    if (amount <= 0) {
      return RequestResponse.error(
        "Por favor ingrese un valor valido en el monto."
      );
    }

    if (userId) {
      const exist_user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
      if (!exist_user) {
        return RequestResponse.error();
      }
    }

    if (lessonId) {
      const exist_lesson = await prisma.lesson.findUnique({
        where: {
          id: lessonId,
        },
      });
      if (!exist_lesson) {
        return RequestResponse.error();
      }
    }

    const date_parsed = parse(date, "yyyy-MM-dd", new Date());
    const year = getYear(date_parsed);
    const month = getMonth(date_parsed) + 1;
    const week = getWeek(new Date(date_parsed));

    await prisma.transaction.create({
      data: {
        date: new Date(date).toISOString(),
        amount,
        type,
        year,
        month,
        week,
        ...(concept && {
          concept,
        }),
        ...(userId && {
          userId,
        }),
        ...(lessonId && {
          lessonId,
        }),
      },
    });

    return RequestResponse.success();
  } catch (error) {
    console.error("Error in CreateNewTransaction()", error);
    return RequestResponse.error();
  }
}

export async function updateTransaction(prev, form_dada) {
  try {
    const { date, amount, type, concept, userId, lessonId, updateId } =
      form_dada;

    if (!date || !amount || !type || !updateId) {
      return RequestResponse.error(
        "Por favor rellene los campos obligatorios."
      );
    }

    if (amount <= 0) {
      return RequestResponse.error(
        "Por favor ingrese un valor valido en el monto."
      );
    }

    if (userId) {
      const exist_user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
      if (!exist_user) {
        return RequestResponse.error();
      }
    }

    if (lessonId) {
      const exist_lesson = await prisma.lesson.findUnique({
        where: {
          id: lessonId,
        },
      });
      if (!exist_lesson) {
        return RequestResponse.error();
      }
    }

    const transaction_prev = prisma.transaction.findUnique({
      where: {
        id: updateId,
      },
      select: {
        id: true,
      },
    });

    if (!transaction_prev) {
      throw new Error("transaction not found");
    }

    const date_current = parse(date, "yyyy-MM-dd", new Date());
    const year = getYear(date_current);
    const month = getMonth(date_current) + 1;
    const week = getWeek(new Date(date_current));

    await prisma.transaction.update({
      where: {
        id: updateId,
      },
      data: {
        date: new Date(date).toISOString(),
        amount,
        type,
        year,
        month,
        week,
        ...(concept && {
          concept,
        }),
        ...(userId && {
          userId,
        }),
        ...(lessonId && {
          lessonId,
        }),
      },
    });

    return RequestResponse.success();
  } catch (error) {
    console.error("Error in updateTransaction()", error);
    return RequestResponse.error();
  }
}

export async function handleUpsertTransaction(prev, form_dada) {
  try {
    const { operation } = form_dada;
    if (!operation) return RequestResponse.error();

    if (operation === "create") return createNewTransaction(null, form_dada);
    if (operation === "update") return updateTransaction(null, form_dada);
  } catch (error) {
    console.error("Error in handleUpsertTransaction()", error);
    return RequestResponse.error();
  }
}

export async function getMonhtlyTransactions(prev, form_dada) {
  try {
    const { month, year } = form_dada;
    if (!month || !year) {
      throw new Error("Field problems in !month || !year");
    }
    const weekly_transactions = await prisma.transaction.findMany({
      where: {
        month,
        year,
      },
      orderBy: {
        week: "desc",
      },
    });

    const totals = weekly_transactions.reduce(
      (acc, transaction) => {
        if (transaction.type === "income") {
          acc.income += transaction.amount;
        } else if (transaction.type === "expense") {
          acc.expense += transaction.amount;
        }
        return acc;
      },
      { income: 0, expense: 0 }
    );

    const balance = totals.income - totals.expense;

    const grouped_data = weekly_transactions.reduce((acc, transaction) => {
      if (!acc[transaction.week]) {
        acc[transaction.week] = [];
      }
      acc[transaction.week].push(transaction);
      return acc;
    }, {});

    const sorted_weeks = Object.entries(grouped_data)
      .map(([week, transactions]) => ({
        week: Number(week),
        transactions,
      }))
      .sort((a, b) => b.week - a.week);

    const monthtly_transactions = {
      all_transactions: sorted_weeks,
      total_income: totals.income,
      total_expense: totals.expense,
      balance: balance,
      month: month,
      year: year,
    };

    return RequestResponse.success(monthtly_transactions);
  } catch (error) {
    console.error("Error in getWeeklyTransactions()", error);
    return RequestResponse.error();
  }
}

export async function getWeeklyTransactions() {
  try {
    const weekly_transactions = await prisma.transaction.groupBy({
      by: ["year", "month"],
      where: {
        year: 2024,
      },
      _sum: {
        amount: true,
      },
      orderBy: {
        month: "asc",
      },
    });

    return RequestResponse.success();
  } catch (error) {
    console.error("Error in getWeeklyTransactions()", error);
    return RequestResponse.error();
  }
}

export async function deleteTransactions(prev, transaction_ids) {
  try {
    if (!transaction_ids || transaction_ids.length < 1) {
      throw new Error(
        "Field problems in !transaction_ids || transaction_ids.length < 1"
      );
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        id: {
          in: transaction_ids,
        },
      },
      select: {
        id: true,
      },
    });

    if (transaction_ids.length !== transactions.length) {
      throw new Error(
        "Error in transaction_ids.length !== transactions.length"
      );
    }

    await prisma.transaction.deleteMany({
      where: {
        id: {
          in: transaction_ids,
        },
      },
    });

    return RequestResponse.success();
  } catch (error) {
    console.error("Error in deleteTransactions()", error);
    return RequestResponse.error();
  }
}

export async function createNewDebts(prev, form_dada) {
  try {
    const { amount, type, concept, userId, lessonId } = form_dada;

    if (!amount || !type) {
      return RequestResponse.error(
        "Por favor rellene los campos obligatorios."
      );
    }

    if (amount <= 0) {
      return RequestResponse.error(
        "Por favor ingrese un valor valido en el monto."
      );
    }

    if (userId) {
      const exist_user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
      if (!exist_user) {
        return RequestResponse.error();
      }
    }

    if (lessonId) {
      const exist_lesson = await prisma.lesson.findUnique({
        where: {
          id: lessonId,
        },
      });
      if (!exist_lesson) {
        return RequestResponse.error();
      }
    }

    const current_date = new Date();
    const year = getYear(current_date);
    const month = getMonth(current_date) + 1;
    const week = getWeek(new Date(current_date));

    const new_debts = await prisma.debt.create({
      data: {
        date: new Date().toISOString(),
        amount,
        type,
        year,
        month,
        week,
        ...(concept && {
          concept,
        }),
        ...(userId && {
          userId,
        }),
        ...(lessonId && {
          lessonId,
        }),
      },
    });
    return RequestResponse.success();
  } catch (error) {
    console.error("Error in CreateNewDebts()", error);
    return RequestResponse.error();
  }
}

export async function getAllDebt() {
  try {
    const all_debt = await prisma.debt.findMany({
      orderBy: {
        date: "desc",
      },
    });
    return RequestResponse.success(all_debt);
  } catch (error) {
    console.error("Error in getAllDebt()", error);
    return RequestResponse.error();
  }
}

export async function updateDebt(prev, form_dada) {
  try {
    const { amount, type, concept, userId, lessonId, updateId } = form_dada;

    if (!amount || !type || !updateId) {
      return RequestResponse.error(
        "Por favor rellene los campos obligatorios."
      );
    }

    if (amount <= 0) {
      return RequestResponse.error(
        "Por favor ingrese un valor valido en el monto."
      );
    }

    if (userId) {
      const exist_user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
      if (!exist_user) {
        return RequestResponse.error();
      }
    }

    if (lessonId) {
      const exist_lesson = await prisma.lesson.findUnique({
        where: {
          id: lessonId,
        },
      });
      if (!exist_lesson) {
        return RequestResponse.error();
      }
    }

    const debt_prev = prisma.debt.findUnique({
      where: {
        id: updateId,
      },
      select: {
        id: true,
      },
    });

    if (!debt_prev) {
      throw new Error("transaction not found");
    }

    const date_current = new Date();
    const year = getYear(date_current);
    const month = getMonth(date_current) + 1;
    const week = getWeek(new Date(date_current));

    await prisma.debt.update({
      where: {
        id: updateId,
      },
      data: {
        date: date_current.toISOString(),
        amount,
        type,
        year,
        month,
        week,
        ...(concept && {
          concept,
        }),
        ...(userId && {
          userId,
        }),
        ...(lessonId && {
          lessonId,
        }),
      },
    });

    return RequestResponse.success();
  } catch (error) {
    console.error("Error in updateDebt()", error);
    return RequestResponse.error();
  }
}

export async function handleUpsertDebt(prev, form_dada) {
  try {
    const { operation } = form_dada;
    if (!operation) return RequestResponse.error();

    if (operation === "create") return createNewDebts(null, form_dada);
    if (operation === "update") return updateDebt(null, form_dada);
  } catch (error) {
    console.error("Error in handleUpsertDebt()", error);
    return RequestResponse.error();
  }
}

export async function deleteDebts(prev, debt_ids) {
  try {
    if (!debt_ids || debt_ids.length < 1) {
      throw new Error("Field problems in !debt_ids || debt_ids.length < 1");
    }

    const debts = await prisma.debt.findMany({
      where: {
        id: {
          in: debt_ids,
        },
      },
      select: {
        id: true,
      },
    });

    if (debt_ids.length !== debts.length) {
      throw new Error("Error in debt_ids.length !== transactions.length");
    }

    await prisma.debt.deleteMany({
      where: {
        id: {
          in: debt_ids,
        },
      },
    });

    return RequestResponse.success();
  } catch (error) {
    console.error("Error in deleteDebts()", error);
    return RequestResponse.error();
  }
}

export async function yearlyTransactions(year) {
  try {
    const yearly_transactions = await prisma.transaction.groupBy({
      by: ["year", "type"],
      where: {
        year,
      },
      _sum: {
        amount: true,
      },
      orderBy: {
        year: "asc",
      },
    });

    return RequestResponse.success(yearly_transactions);
  } catch (error) {
    console.error("Error in yearlyTransactions()", error);
    return RequestResponse.error();
  }
}

export async function getMonthlyTransactionsByYear(year) {
  try {
    const monthtly_transactions = await prisma.transaction.groupBy({
      by: ["year", "month", "type"],
      where: {
        year: year,
      },
      _sum: {
        amount: true,
      },
      orderBy: {
        month: "asc",
      },
    });

    return RequestResponse.success(monthtly_transactions);
  } catch (error) {
    console.error("Error in getMonthlyTransactions()", error);
    return RequestResponse.error();
  }
}

export async function getAnnualAndMonthlyBalance(prev, year_data) {
  try {
    const year = parseInt(year_data, 10);
    if (typeof year !== "number" || !year) {
      throw new Error("Invalid year, typeof year !== 'number' || !year");
    }

    const yearly_transactions_response = await yearlyTransactions(year);
    const monthly_transactions_response =
      await getMonthlyTransactionsByYear(year);

    const yearly_transactions = yearly_transactions_response.data;
    const monthly_transactions = monthly_transactions_response.data;

    const balance = {
      income:
        yearly_transactions.find((t) => t.type === "income")?._sum.amount ?? 0,
      expense:
        yearly_transactions.find((t) => t.type === "expense")?._sum.amount ?? 0,
    };

    const months = monthly_transactions.reduce((acc, transaction) => {
      const month = transaction.month;

      if (!acc[month]) {
        acc[month] = {
          month,
          income: 0,
          expense: 0,
        };
      }

      if (transaction.type === "income") {
        acc[month].income = transaction._sum.amount;
      } else {
        acc[month].expense = transaction._sum.amount;
      }

      return acc;
    }, {});

    const months_array = Object.values(months).sort(
      (a, b) => a.month - b.month
    );

    const annual_and_monthly_balance = {
      year,
      balance,
      months: months_array,
    };

    return RequestResponse.success(annual_and_monthly_balance);
  } catch (error) {
    console.error("Error in getAnnualAndMonthlyBalance()", error);
    return RequestResponse.error();
  }
}
