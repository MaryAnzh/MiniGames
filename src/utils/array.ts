export const arrayFromNumber = (num: number, start = 0) =>
  Array.from({ length: num }, (_, i) => i + start);
