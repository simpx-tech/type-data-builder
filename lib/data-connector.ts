import { DataBuilder } from "./data-builder";
import { DataCache } from "./data-cache";
import { DataFactory } from "./data-factory";
import { DataSchema } from "./data-schema";
import { IFieldConfig } from "./interfaces/schema.interface";
import { isDict } from "./utils/is-dict";

export class DataConnector {
  constructor(private builder: DataBuilder) {}

  setConnectionVariation(entity: DataSchema, variation: number) {
    const currentFields = Object.entries(this.builder.schema.config);

    for (const [field, fieldType] of currentFields) {
      if (isDict(fieldType)) {
        const fieldConfig = fieldType as IFieldConfig;

        if (fieldConfig.ref === entity) {
          const data = DataFactory.create(entity, { variation }).raw();
          this.builder.set({ [field]: data });
        }
      }
    }
  }

  connect(entity: DataSchema, variation = 0) {
    const builderFields = Object.entries(this.builder.schema.config);

    for (const [field, fieldType] of builderFields) {
      if (isDict(fieldType)) {
        const fieldConfig = fieldType as IFieldConfig;

        if (fieldConfig.ref === entity) {
          let data = DataCache.getVariation(entity, variation);

          if (!data) {
            data = DataFactory.create(entity, { variation }).raw();
          }

          this.builder.set({ [field]: data });
          return;
        }
      }
    }

    throw new Error(
      `This schema has no relation to the builder schema (the builder schema doesn't has any ${entity.constructor.name} schema)`
    );
  }
}
