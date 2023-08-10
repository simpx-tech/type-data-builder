import { ISchema } from "./interfaces/schema.interface";

export class DataSchema {
  schemaConfig: ISchema;
  __internalId: Symbol;

  constructor(schemaConfig: ISchema) {
    this.schemaConfig = schemaConfig;
    this.__internalId = Symbol();
  }

  get config() {
    return this.schemaConfig;
  }
}
