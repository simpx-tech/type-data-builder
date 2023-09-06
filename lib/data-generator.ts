import { faker } from "@faker-js/faker";
import { DataBuilder } from "./data-builder";
import { isDict } from "./utils/is-dict";
import { IFieldConfig, ISchema } from "./interfaces";
import { DataSchema } from "./data-schema";
import { DataFactory } from "./data-factory";
import { ObjectId } from "bson";
import { SpecialType } from "./enums";

export class DataGenerator {
  constructor(private builder: DataBuilder) {}

  generate() {
    const schema = this.builder.schema.config;

    const generated = this.generateData(schema);

    this.builder.fullSet(generated);
  }

  private generateData(schema: ISchema, variation: number = 0) {
    return Object.entries(schema).reduce(
      (acc, [field, value]) => {
        let fieldValue;

        if (isDict(value)) {
          const config = value as IFieldConfig;

          if (config.value) {
            fieldValue =
              typeof config.value === "function"
                ? config.value()
                : config.value;
          } else if (config.ref) {
            const refObj = DataFactory.create(config.ref, { variation });
            const idField = DataSchema.getIdField(config.ref);

            fieldValue = refObj.raw()[idField];
          } else if (config.type instanceof DataSchema) {
            fieldValue = this.generateData(config.type.config);
          } else {
            fieldValue = this.genByType(config.type);
          }
        } else {
          fieldValue = this.genByType(value);
        }

        acc[field] = fieldValue;

        return acc;
      },
      {} as Record<string, any>,
    );
  }

  private genByType(type: any) {
    switch (type) {
      case String:
        return this.generateString();
      case Number:
        return this.generateNumber();
      case Boolean:
        return this.generateBoolean();
      case Date:
        return this.generateDate();
      case SpecialType.ObjectId:
        return this.generateObjectId();
      default:
        if (Array.isArray(type)) {
          return this.generateArray(type);
        }

        if (type instanceof DataSchema) {
          return this.generateData(type.config);
        }
    }
  }

  private generateArray(type: any): any {
    const tempObj = this.generateData({
      data: type[0],
    });

    return [tempObj.data];
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

  private generateObjectId() {
    return new ObjectId();
  }
}
