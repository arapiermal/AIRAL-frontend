export const computeAQI = (pm25?: number) => {
  if (pm25 === undefined) return null;
  return Math.round(Math.max(0, Math.min(500, pm25 * 4)));
};
