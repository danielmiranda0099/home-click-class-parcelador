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

export const DAYS_OF_WEEK = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"];

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
