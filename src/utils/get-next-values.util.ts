export const getNextValues = (
  array: string[],
  startValue: string,
  count: number,
) => {
  const startIndex = array.indexOf(startValue);
  if (startIndex === -1) return [];

  return array.slice(startIndex, startIndex + count);
};
