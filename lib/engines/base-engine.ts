import { IDataEngine } from "../interfaces/data-engine.interface";

export class BaseEngine implements IDataEngine {
  getTweaks() {
    return {};
  }

  toString(input: unknown): string {
    if (typeof input === "string") {
      return input;
    }

    if (typeof input === "boolean" || typeof input === "number") {
      return (input as boolean | number).toString();
    }

    if (input instanceof Date) {
      return input.toISOString();
    }

    if (typeof input?.toString === "function") {
      return input.toString();
    }

    throw new Error("Can't be converted to string");
  }

  toNumber(input: unknown): number {
    const number = Number(input);

    if (isNaN(number)) {
      throw new Error("Can't be converted to number");
    }

    return number;
  }

  toBoolean(input: unknown): boolean {
    return Boolean(input);
  }

  toDate(input: unknown): Date {
    if (typeof input === "string" || typeof input === "number") {
      const date = new Date(input);

      if (isNaN(date.getTime())) {
        throw new Error("Can't be converted to date");
      }

      return date;
    }

    throw new Error("Input type not supported for date conversion");
  }

  toJSON(input: unknown): string {
    if (!this.testJSON(input)) {
      throw new Error("Invalid JSON");
    }

    return JSON.stringify(input);
  }

  private testJSON(input: unknown): boolean {
    try {
      JSON.parse(input as string);
      return true;
    } catch (error) {
      return false;
    }
  }
}
