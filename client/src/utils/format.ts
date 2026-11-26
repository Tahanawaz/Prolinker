const pkr = new Intl.NumberFormat('en-PK', { maximumFractionDigits: 0 });

/** "PKR 12,500" (Latin digits in both languages for clarity of amounts). */
export function formatPKR(amount: number): string {
  return `PKR ${pkr.format(Math.round(amount))}`;
}
