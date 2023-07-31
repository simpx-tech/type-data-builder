import { DataBuilder } from "./data-builder";
import { DataFactory } from "./data-factory";
import { IFieldConfig } from "./interfaces/schema.interface";
import { isDict } from "./utils/is-dict";

export class DataConnector {
  constructor(private builder: DataBuilder) {}

  setConnectionVariation(entity: Symbol, variation: number) {
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

  connect(entityBuilder: DataBuilder) {
    const connectingSchema = entityBuilder.schema;
    const currentFields = Object.entries(this.builder.schema.config);

    for (const [field, fieldType] of currentFields) {
      if (isDict(fieldType)) {
        const fieldConfig = fieldType as IFieldConfig;

        if (fieldConfig.ref === connectingSchema.getIdentifier()) {
          const data = entityBuilder.raw();
          this.builder.set({ [field]: data });
        }
      }
    }
  }
}
