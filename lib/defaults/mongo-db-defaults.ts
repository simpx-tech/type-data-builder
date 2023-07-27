import { BaseDefaults } from "./base-defaults";

export class MongoDataBuilderDefaults extends BaseDefaults {
  getTweaks() {
    return {
      output: {},
      input: {},
    };
  }
}
