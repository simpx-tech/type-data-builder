import { DataSchema } from "./data-schema";

export class DataCache {
  private static cachedVariationsBySchema: Map<
    DataSchema,
    Record<string, any>
  > = new Map();

  static saveVariation(
    schema: DataSchema,
    variationIndex: number,
    variation: any
  ) {
    this.cachedVariationsBySchema.set(schema, {
      ...this.cachedVariationsBySchema.get(schema),
      [variationIndex]: variation,
    });
  }

  static getVariation(schema: DataSchema, variationIndex: number) {
    const entityVariations = this.cachedVariationsBySchema.get(schema) ?? {};

    return entityVariations[variationIndex];
  }
}
