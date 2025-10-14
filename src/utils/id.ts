let counter = 1;
export function genId(prefix = 'id'): string {
  return `${prefix}-${counter++}`;
}
