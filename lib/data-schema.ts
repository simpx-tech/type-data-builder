import { ISchema } from "./interfaces/schema.interface";

export class DataSchema {
  schemaConfig: ISchema;

  private readonly __internalId = Symbol();

  constructor(schemaConfig: ISchema) {
    this.schemaConfig = schemaConfig;
  }

  getIdentifier() {
    return this.__internalId;
  }

  get config() {
    return this.schemaConfig;
  }

  [Symbol.toStringTag]() {
    return this.__internalId.toString();
  }
}
