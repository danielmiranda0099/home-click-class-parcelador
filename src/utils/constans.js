import moment from "moment";

export const DAYS_OF_WEEK_NUMBER = {
  Do: 0,
  Lu: 1,
  Ma: 2,
  Mi: 3,
  Ju: 4,
  Vi: 5,
  Sa: 6,
};

export const DAYS_OF_WEEK_NUMBER_2 = {
  Do: 6,
  Lu: 0,
  Ma: 1,
  Mi: 2,
  Ju: 3,
  Vi: 4,
  Sa: 5,
};

export const DAYS_OF_WEEK = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"];
export const DAYS_OF_WEEK_2 = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"];

export const DAYS_OF_WEEK_FULL = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

export const DATA_LESSON_DEFAULT = {
  students: [{ student: null, fee: "" }],
  teacher: {
    teacher: null,
    payment: "",
  },
  periodOfTime: "",
  startDate: moment().format("YYYY-MM-DD"),
  selectedDays: [],
  times: {},
};

export const MONTHS_OF_YEAR = {
  1: "Enero",
  2: "Febrero",
  3: "Marzo",
  4: "Abril",
  5: "Mayo",
  6: "Junio",
  7: "Julio",
  8: "Agosto",
  9: "Septiembre",
  10: "Octubre",
  11: "Noviembre",
  12: "Diciembre",
};
