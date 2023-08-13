import { IFieldConfig, ISchema } from "./interfaces/schema.interface";
import { isDict } from "./utils/is-dict";

export class DataSchema {
  schemaConfig: ISchema;

  constructor(schemaConfig: ISchema) {
    this.schemaConfig = schemaConfig;
  }

  get config() {
    return this.schemaConfig;
  }

  static getIdField<T extends DataSchema>(schema: T): keyof T {
    for (const [field, fieldType] of Object.entries(schema.config)) {
      if (isDict(fieldType)) {
        const fieldConfig = fieldType as IFieldConfig;

        if (fieldConfig.id === true) {
          return field as keyof T;
        }
      }
    }

    throw new Error(
      "No id field was set. Set a field with id: true on the schema to use this"
    );
  }
}
