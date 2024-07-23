export const calculateNewSize = (
  current: number,
  start: number,
  size: number
) => {
  return Math.max(1, Math.round((current - start) / size));
};
