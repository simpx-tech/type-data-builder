export function isDict(input: unknown): input is Record<string, any> {
  return typeof input === "object" && input!.constructor === Object;
}
