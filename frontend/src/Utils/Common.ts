function ConstructDate(
  year: number,
  month: number,
  date: number,
  timeString: string
) {
  return `${year}-${month + 1}-${date} ${timeString.split(" ")[0]}`;
}
export function isTokenExpired(miliseconds: number): boolean {
  const expDateString = new Date(miliseconds).toTimeString();
  const currentDate = new Date();
  const constructedDate = ConstructDate(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate(),
    expDateString
  );
  const expiryDate = new Date(constructedDate);
  if (expiryDate.getTime() > currentDate.getTime()) {
    return true;
  } else {
    return false;
  }
}
