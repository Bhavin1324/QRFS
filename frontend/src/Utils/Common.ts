export function isTokenExpired(miliseconds: number): boolean {
  if (miliseconds > new Date().getTime()) {
    return true;
  } else {
    return false;
  }
}
