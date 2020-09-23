export function map(
  n: number,
  start1: number,
  stop1: number,
  start2: number,
  stop2: number,
  withinBounds: boolean = false
): number {
  const output = ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2
  if (!withinBounds) return output
  return start2 < stop2
    ? constrain(output, start2, stop2)
    : constrain(output, stop2, start2)
}

export function constrain(n: number, low: number, high: number): number {
  return Math.max(Math.min(n, high), low)
}
