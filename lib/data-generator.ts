import { faker } from "@faker-js/faker";
import { DataBuilder } from "./data-builder";
import { isDict } from "./utils/is-dict";
import { IFieldConfig, ISchema } from "./interfaces/schema.interface";
import { DataSchema } from "./data-schema";
import { DataFactory } from "./data-factory";

export class DataGenerator {
  constructor(private builder: DataBuilder) {}

  generate() {
    const schema = this.builder.schema.config;

    const generated = this.generateData(schema);

    this.builder.setFull(generated);
  }

  private generateData(schema: ISchema, variation: number = 0) {
    const generated = Object.entries(schema).reduce((acc, [field, value]) => {
      let fieldValue;
      if (isDict(value)) {
        const config = value as IFieldConfig;

        if (config.ref) {
          const refObj = DataFactory.create(config.ref, { variation });
          const refId = refObj.raw()._id;
          fieldValue = refId;
        }

        if (config.type instanceof DataSchema) {
          const data = this.generateData(config.type.config);
          fieldValue = data;
        }

        if (Array.isArray(config.type)) {
          const data = this.generateData({ [field]: config.type[0] });
          fieldValue = [data[field]];
        }

        const userGeneratedValue =
          typeof config.value === "function" ? config.value() : config.value;

        fieldValue = userGeneratedValue || this.genByType(config.type);
      } else {
        this.genByType(typeof value);
      }

      acc[field] = fieldValue;

      return acc;
    }, {} as Record<string, any>);

    return generated;
  }

  private genByType(type: string) {
    switch (type) {
      case "string":
        return this.generateString();
      case "number":
        return this.generateNumber();
      case "boolean":
        return this.generateBoolean();
      case "date":
        return this.generateDate();
    }
  }

  private generateString() {
    return faker.word.sample();
  }

  private generateNumber() {
    return faker.number.int();
  }

  private generateBoolean() {
    return faker.datatype.boolean();
  }

  private generateDate() {
    return faker.date.recent();
  }
}
