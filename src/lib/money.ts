export function parseMDL(value: string): number {
  const amount = parseInt(value.replace(/\s/g, "").replace("MDL", ""), 10);
  return Number.isNaN(amount) ? 0 : amount;
}

export function formatMDL(value: number): string {
  return `${value.toLocaleString("ro-MD")} MDL`;
}
