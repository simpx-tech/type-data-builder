import { defaultTweakSymbol } from "./constants/default-tweak-symbol";
import { MongoEngine } from "./engines/mongo-engine";
import { IDataEngine } from "./interfaces/data-engine.interface";
import { ISchema } from "./interfaces/schema.interface";

export class DataConfig {
  private static schemas = new Map<string, ISchema>();
  private static predefinedVariations = new Map<
    string,
    Record<string, any[]>
  >();

  private static engine: IDataEngine = new MongoEngine();

  static registerSchema(
    entity: string,
    schema: ISchema,
    extraConfig: {
      predefinedVariations?: any[];
      tweaksVariations?: Record<string, any[]>;
    } = {}
  ) {
    const { predefinedVariations, tweaksVariations } = extraConfig;

    this.schemas.set(entity, schema);
    this.predefinedVariations.set(entity, {
      [defaultTweakSymbol]: predefinedVariations ?? [],
      ...tweaksVariations,
    });

    return this;
  }

  static getEngine() {
    return this.engine;
  }

  static setEngine(engine: IDataEngine) {
    this.engine = engine;
  }

  static getSchema(entity: string) {
    return this.schemas.get(entity) as ISchema;
  }
}
