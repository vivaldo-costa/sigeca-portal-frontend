type ClassValue = string | number | bigint | null | boolean | undefined | ClassValue[]

function flatten(input: ClassValue, out: string[]) {
  if (!input && input !== 0) return
  if (Array.isArray(input)) {
    input.forEach((v) => flatten(v, out))
    return
  }
  out.push(String(input))
}

/** Combina classes condicionalmente, tal como clsx/cn. Sem dependências extra. */
export function cn(...inputs: ClassValue[]): string {
  const out: string[] = []
  inputs.forEach((i) => flatten(i, out))
  return out.join(' ')
}
