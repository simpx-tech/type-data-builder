import { defaultTweakSymbol } from "./constants/default-tweak-symbol";
import { DataSchema } from "./data-schema";

export class DataConfig {
  private static schemas = new Set<DataSchema>();
  private static predefinedVariationsBySchema = new Map<
    DataSchema,
    Record<string, any>
  >();

  static registerSchema(
    schema: DataSchema,
    extraConfig: {
      predefinedVariations?: any[];
      tweaksVariations?: Record<string, any[]>;
    } = {}
  ) {
    const { predefinedVariations, tweaksVariations } = extraConfig;

    this.schemas.add(schema);
    // DEV add predefined variations to DataCache instead
    this.predefinedVariationsBySchema.set(schema, {
      [defaultTweakSymbol]: predefinedVariations ?? [],
      ...tweaksVariations,
    });

    return this;
  }
}
