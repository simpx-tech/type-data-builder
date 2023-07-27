import { faker } from "@faker-js/faker";
import { IDefaultsConfig } from "../interfaces/defaults-config.interface";

export class BaseDefaults implements IDefaultsConfig {
  getNumber() {
    return faker.number.int();
  }

  getString() {
    return faker.word.sample();
  }

  getTweaks() {
    return {};
  }
}
