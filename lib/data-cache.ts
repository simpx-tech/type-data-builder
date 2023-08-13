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

  static registerVariations(schema: DataSchema, variation: any) {
    // DEV
  }

  static getById(schema: DataSchema, id: string) {
    const variations = this.cachedVariationsBySchema.get(schema) ?? {};

    const idField = DataSchema.getIdField(schema);

    let foundVariation: any = undefined;
    Object.keys(variations).findIndex((variationIndex) => {
      const variation = variations[variationIndex];

      if (variation[idField] && variation[idField].toString() === id) {
        foundVariation = variation;
        return true;
      }
    });

    return foundVariation;
  }

  static getVariation(schema: DataSchema, variationIndex: number) {
    const entityVariations = this.cachedVariationsBySchema.get(schema) ?? {};

    return entityVariations[variationIndex];
  }

  static lookForEmptyVariation(schema: DataSchema) {
    const variations = this.cachedVariationsBySchema.get(schema) ?? {};

    const variationsIndexes = Object.keys(variations);

    const lastVariationId = Math.max.apply(
      null,
      variationsIndexes.map((index) => Number(index))
    );

    return lastVariationId + 1;
  }
}
