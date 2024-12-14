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

export async function getMonhtlyTransactions(month) {
  try {
    const weekly_transactions = await prisma.transaction.findMany({
      where: {
        month,
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

export async function deleteDebts(prev, debt_ids) {
  try {
    if (!debt_ids || debt_ids.length < 1) {
      throw new Error(
        "Field problems in !debt_ids || debt_ids.length < 1"
      );
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
      throw new Error(
        "Error in debt_ids.length !== transactions.length"
      );
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
