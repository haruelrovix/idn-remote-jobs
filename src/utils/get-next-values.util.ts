export const getNextValues = (
  array: string[],
  startValue: string,
  count: number,
) => {
  const startIndex = array.indexOf(startValue);
  if (startIndex === -1) return [];

  const nextIndex = startIndex + 1;

  return array.slice(nextIndex, nextIndex + count);
};
