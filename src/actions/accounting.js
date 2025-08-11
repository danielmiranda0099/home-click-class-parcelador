"use server";
import prisma from "@/lib/prisma";
import { RequestResponse } from "@/utils/requestResponse";
import { getMonth, getWeek, getYear, parse } from "date-fns";

export async function createNewTransaction(prev, form_dada) {
  try {
    const { date, amount, type, concept, userId, lessonId, expenseCategory } =
      form_dada;

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

    if (type === "expense" && !expenseCategory) {
      return RequestResponse.error("Para un Egreso debe indicar su tipo.");
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
        expenseCategory: type === "expense" ? expenseCategory : null,
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
    const {
      date,
      amount,
      type,
      concept,
      userId,
      lessonId,
      updateId,
      expenseCategory,
    } = form_dada;

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

    if (type === "expense" && !expenseCategory) {
      return RequestResponse.error("Para un Egreso debe indicar su tipo.");
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
        expenseCategory: type === "expense" ? expenseCategory : null,
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

/**
 * Retrieves monthly transactions from the database, grouped by week.
 *
 * This function:
 * - Separates expenses into `expenseTeacher` (category "teacher") and `expenseOther` (category "other").
 * - Calculates total income, total expenses per category, and overall balance.
 * - Groups transactions by week, calculating weekly income and expenses.
 *
 * @param {any} prev - Currently unused; kept for API consistency.
 * @param {{ month: number, year: number }} formData - The month (1-12) and year (e.g., 2025) to query.
 * @returns {Promise<import("@/types").RequestResponse>} - A standardized response object containing:
 *    - all_transactions: Array of weekly transaction groups with balances.
 *    - totalIncome: Sum of all income transactions for the month.
 *    - expenseTeacher: Sum of all teacher-category expenses.
 *    - expenseOther: Sum of all other-category expenses.
 *    - totalExpense: Sum of `expenseTeacher` and `expenseOther`.
 *    - balance: totalIncome - totalExpense.
 *    - month, year.
 *
 * Edge cases considered:
 * - If there are no transactions, all totals will be 0 and the transactions list empty.
 * - If some expenses have no `expenseCategory`, they will not be included in either category.
 * - Weeks without transactions are excluded from the result.
 * - Weeks are sorted from highest to lowest number.
 */
export async function getMonhtlyTransactions(prev, formData) {
  try {
    const { month, year } = formData;
    if (!month || !year) {
      throw new Error("Month and year are required.");
    }

    const weeklyTransactions = await prisma.transaction.findMany({
      where: { month, year },
      orderBy: { week: "desc" },
    });

    const totals = weeklyTransactions.reduce(
      (acc, transaction) => {
        if (transaction.type === "income") {
          acc.totalIncome += transaction.amount;
        } else if (transaction.type === "expense") {
          if (transaction.expenseCategory === "teacher") {
            acc.expenseTeacher += transaction.amount;
          } else if (transaction.expenseCategory === "other") {
            acc.expenseOther += transaction.amount;
          }
        }
        return acc;
      },
      { totalIncome: 0, expenseTeacher: 0, expenseOther: 0 }
    );

    const totalExpense = totals.expenseTeacher + totals.expenseOther;
    const balance = totals.totalIncome - totalExpense;

    const groupedData = weeklyTransactions.reduce((acc, transaction) => {
      if (!acc[transaction.week]) {
        acc[transaction.week] = {
          transactions: [],
          incomeWeek: 0,
          expenseTeacherWeek: 0,
          expenseOtherWeek: 0,
        };
      }
      acc[transaction.week].transactions.push(transaction);

      if (transaction.type === "income") {
        acc[transaction.week].incomeWeek += transaction.amount;
      } else if (transaction.type === "expense") {
        if (transaction.expenseCategory === "teacher") {
          acc[transaction.week].expenseTeacherWeek += transaction.amount;
        } else if (transaction.expenseCategory === "other") {
          acc[transaction.week].expenseOtherWeek += transaction.amount;
        }
      }

      return acc;
    }, {});

    const sortedWeeks = Object.entries(groupedData)
      .map(([week, data]) => ({
        week: Number(week),
        transactions: data.transactions,
        income: data.incomeWeek,
        expenseTeacher: data.expenseTeacherWeek,
        expenseOther: data.expenseOtherWeek,
        totalExpense: data.expenseTeacherWeek + data.expenseOtherWeek,
        balance:
          data.incomeWeek - (data.expenseTeacherWeek + data.expenseOtherWeek),
      }))
      .sort((a, b) => b.week - a.week);

    const monthlyTransactions = {
      all_transactions: sortedWeeks,
      totalIncome: totals.totalIncome,
      expenseTeacher: totals.expenseTeacher,
      expenseOther: totals.expenseOther,
      totalExpense,
      balance,
      month,
      year,
    };

    return RequestResponse.success(monthlyTransactions);
  } catch (error) {
    console.error("Error in getMonhtlyTransactions()", error);
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
    const { amount, type, concept, userId, lessonId, expenseCategory } =
      form_dada;

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

    if (type === "expense" && !expenseCategory) {
      return RequestResponse.error("Para un Egreso debe indicar su tipo.");
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
        expenseCategory: type === "expense" ? expenseCategory : null,
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
    const {
      amount,
      type,
      concept,
      userId,
      lessonId,
      updateId,
      expenseCategory,
    } = form_dada;

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

    if (type === "expense" && !expenseCategory) {
      return RequestResponse.error("Para un Egreso debe indicar su tipo.");
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
        expenseCategory: type === "expense" ? expenseCategory : null,
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

export async function moveDebtToTransaction(debt_ids) {
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
    });

    if (debt_ids.length !== debts.length) {
      throw new Error("Error in debt_ids.length !== debts.length");
    }

    const current_date = new Date();
    const year = getYear(current_date);
    const month = getMonth(current_date) + 1;
    const week = getWeek(new Date(current_date));

    const data_transactions = debts.map((debt) => ({
      date: new Date().toISOString(),
      amount: debt.amount,
      type: debt.type,
      expenseCategory: debt.type === "expense" ? debt.expenseCategory : null,
      concept: debt.concept,
      year,
      month,
      week,
    }));

    await prisma.$transaction(async (tx) => {
      await tx.debt.deleteMany({
        where: {
          id: {
            in: debt_ids,
          },
        },
      });

      await tx.transaction.createMany({
        data: data_transactions,
      });
    });

    return RequestResponse.success();
  } catch (error) {
    console.error("Error in moveDebtToTransaction()", error);
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
