import { ISchemaMolds } from "./schema.interface";

export interface IDataEngine {
  toNumber(input: unknown): number;
  toBoolean(input: unknown): boolean;
  toString(input: unknown): string;
  toDate(input: unknown): Date;
  toJSON(input: unknown): string;

  getMolds(): Record<string, ISchemaMolds>;
}
