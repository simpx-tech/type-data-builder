export function deepCopy(obj: Record<string, any>) {
  return JSON.parse(JSON.stringify(obj));
}
