export const isSciNumber = (num) => {
  return /\d(?:.(\d*))?e([+-]\d+)/.test(num);
};
