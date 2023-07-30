import { defaultTweakSymbol } from "./constants/default-tweak-symbol";
import { DataSchema } from "./data-schema";

export class DataConfig {
  private static schemas = new Map<Symbol, DataSchema>();
  private static predefinedVariationsByEntity = new Map<
    Symbol,
    Record<string, any[]>
  >();

  static registerSchema(
    entity: Symbol,
    schema: DataSchema,
    extraConfig: {
      predefinedVariations?: any[];
      tweaksVariations?: Record<string, any[]>;
    } = {}
  ) {
    const { predefinedVariations, tweaksVariations } = extraConfig;

    this.schemas.set(entity, schema);
    this.predefinedVariationsByEntity.set(entity, {
      [defaultTweakSymbol]: predefinedVariations ?? [],
      ...tweaksVariations,
    });

    return this;
  }

  static getSchema(entity: Symbol) {
    return this.schemas.get(entity);
  }
}
