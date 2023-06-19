export const getDate = (): string => {
  let today: Date | string = new Date();
  let dd: number | string = today.getDate();

  let mm: number | string = today.getMonth() + 1;
  const yyyy: number | string = today.getFullYear();
  if (10 > dd) {
    dd = `0${dd}`;
  }

  if (10 > mm) {
    mm = `0${mm}`;
  }
  today = `${mm}-${dd}-${yyyy}`;
  return today;
};
