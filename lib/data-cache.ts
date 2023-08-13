import { DataSchema } from "./data-schema";

export class DataCache {
  private static cachedVariationsBySchema: Map<DataSchema, any[]> = new Map();

  static saveVariation(
    schema: DataSchema,
    variationIndex: number,
    variation: any
  ) {
    const arr = [...(this.cachedVariationsBySchema.get(schema) ?? [])];
    arr[variationIndex] = variation;

    this.cachedVariationsBySchema.set(schema, arr);
  }

  static registerVariations(schema: DataSchema, variations: any[]) {
    const cachedVariations = this.cachedVariationsBySchema.get(schema) ?? [];

    this.cachedVariationsBySchema.set(schema, [
      ...cachedVariations,
      ...variations,
    ]);
  }

  static getById(schema: DataSchema, id: any) {
    const variations = this.cachedVariationsBySchema.get(schema) ?? [];

    const idField = DataSchema.getIdField(schema);

    let foundVariation: any = undefined;
    Object.keys(variations).findIndex((variationIndex) => {
      const variation = variations[Number(variationIndex)];

      if (
        variation[idField] &&
        variation[idField].toString() === id.toString()
      ) {
        foundVariation = variation;
        return true;
      }
    });

    return foundVariation;
  }

  static getVariation(schema: DataSchema, variationIndex: number) {
    const entityVariations = this.cachedVariationsBySchema.get(schema) ?? [];

    return entityVariations[variationIndex];
  }

  static lookForEmptyVariation(schema: DataSchema) {
    const variations = this.cachedVariationsBySchema.get(schema) ?? [];

    const variationsIndexes = Object.keys(variations);

    if (variationsIndexes.length === 0) {
      return 0;
    }

    const lastVariationId = Math.max.apply(
      null,
      variationsIndexes.map((index) => Number(index))
    );

    return lastVariationId + 1;
  }
}
