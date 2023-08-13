import { DataSchema } from "../data-schema";

export type ISchema = Record<
  string,
  | IFieldConfig
  | StringConstructor
  | DateConstructor
  | NumberConstructor
  | BooleanConstructor
  | StringConstructor[]
  | DateConstructor[]
  | NumberConstructor[]
  | BooleanConstructor[]
  | IFieldConfig[]
>;

export interface ISchemaMolds {
  // TODO show all possibilities in Typescript
  exclude?: string[];

  // TODO show all possibilities in Typescript
  setFields?: ISchema;
}

export interface IFieldConfig {
  type: any | (() => any);
  id?: boolean;
  value?: any | (() => any);
  array?: boolean;
  // TODO show all possibilities in Typescript
  ref?: DataSchema;
}
