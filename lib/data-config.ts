import { MongoDataBuilderDefaults } from "./defaults/mongo-db-defaults";
import { IDefaultsConfig } from "./interfaces/defaults-config.interface";
import { ISchema } from "./interfaces/schema.interface";

export class DataConfig {
  private static schemas = new Map<string, ISchema>();
  private static predefinedVariations = new Map<string, any[]>();

  static __defaults: IDefaultsConfig = new MongoDataBuilderDefaults();

  static registerSchema(
    entity: string,
    schema: ISchema,
    predefinedVariations: any[]
  ) {
    this.schemas.set(entity, schema);
    this.predefinedVariations.set(entity, predefinedVariations);

    return this;
  }

  static getSchema(entity: string) {
    return this.schemas.get(entity) as ISchema;
  }

  static setDefaults(newDefaults: IDefaultsConfig) {
    this.__defaults = newDefaults;
  }

  static get defaults() {
    return this.__defaults;
  }
}
