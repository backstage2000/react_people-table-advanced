export function getCentury(year: number | null | undefined): string | null {
  if (!year) {
    return null;
  }

  return Math.ceil(year / 100).toString();
}
