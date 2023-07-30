import { DataSchema } from "./data-schema";

export class DataCache {
  private static cachedVariationsByEntity: Map<Symbol, Record<string, any>> =
    new Map();

  static saveVariation(
    entity: DataSchema,
    variationIndex: number,
    variation: any
  ) {
    const entityId = entity.getIdentifier();

    this.cachedVariationsByEntity.set(entityId, {
      ...this.cachedVariationsByEntity.get(entityId),
      [variationIndex]: variation,
    });
  }

  static getVariation(entity: DataSchema, variationIndex: number) {
    const entityId = entity.getIdentifier();

    const entityVariations = this.cachedVariationsByEntity.get(entityId) ?? {};

    return entityVariations[variationIndex];
  }
}
