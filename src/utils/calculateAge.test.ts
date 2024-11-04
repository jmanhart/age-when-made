import { calculateAgeAtDate } from "../utils/calculateAge";

test("calculates correct age", () => {
  const birthDate = "1980-06-15";
  const targetDate = "2020-06-15";
  const age = calculateAgeAtDate(birthDate, targetDate);
  expect(age).toBe(40);
});

test("returns null for invalid date", () => {
  const birthDate = "invalid-date";
  const targetDate = "2020-06-15";
  const age = calculateAgeAtDate(birthDate, targetDate);
  expect(age).toBeNull();
});
