import { faker } from "@faker-js/faker";
import { DataBuilder } from "./data-builder";

export class DataGenerator {
  constructor(private builder: DataBuilder) {}

  generate() {
    const schema = this.builder.schema.config;

    Object.entries(schema).reduce(([field, value]) => {
      if (typeof value === "object" && value.constructor == "Object") {
        // get type from value.type, but before, check value.value
        // Also check if is array
        // Also check if the type if another object/schema
        // Also check if is a reference to another entity (gen id in this case, get the id from variation, if not exists, create it)
      } else {
        this.genByType(typeof value.type);
      }
    });
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
