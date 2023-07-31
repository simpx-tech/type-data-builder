import { DataBuilder } from "./data-builder";
import { IFieldConfig } from "./interfaces/schema.interface";
import { isDict } from "./utils/is-dict";

export class DataConnector {
  constructor(private builder: DataBuilder) {}

  setConnectionVariant() {
    // DEV
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
