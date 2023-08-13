import { DataCache } from "../lib/data-cache";
import { DataSchema } from "../lib/data-schema";

describe("Data Cache", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    (DataCache as any).cachedVariationsByEntity = new Map();
  });

  it("should register a variation on a entity", () => {
    const schema = new DataSchema({ test: Boolean });
    const variationIndex = 0;
    const variation = { test: true };

    DataCache.saveVariation(schema, variationIndex, variation);

    expect(
      (DataCache as any)?.cachedVariationsBySchema?.get?.(schema)
    ).toStrictEqual([variation]);
  });

  it("should return the registered schema", () => {
    const schema = new DataSchema({ test: Boolean });
    const variationIndex = 0;
    const variation = { test: true };

    DataCache.saveVariation(schema, variationIndex, variation);

    const result = DataCache.getVariation(schema, variationIndex);

    expect(result).toBe(variation);
  });

  it("should return the correct schema", () => {
    const schema = new DataSchema({ test: Boolean });
    const schema2 = new DataSchema({ test: Number });
    const variationIndex = 0;
    const variation = { test: true };
    const variation2 = { test: 1 };

    DataCache.saveVariation(schema, variationIndex, variation);
    DataCache.saveVariation(schema2, variationIndex, variation2);

    const result = DataCache.getVariation(schema, variationIndex);

    expect(result).toBe(variation);
  });

  it("should return the correct variation", () => {
    const schema = new DataSchema({ test: Number });
    const variation = { test: 1 };
    const variation2 = { test: 2 };

    DataCache.saveVariation(schema, 0, variation);
    DataCache.saveVariation(schema, 1, variation2);

    const result = DataCache.getVariation(schema, 0);

    expect(result).toBe(variation);
  });

  it("should register many variations at time", () => {
    const schema = new DataSchema({ test: Boolean });
    const variations = [{ test: true }, { test: false }];

    DataCache.registerVariations(schema, variations);

    expect(
      (DataCache as any)?.cachedVariationsBySchema?.get?.(schema)
    ).toStrictEqual(variations);
  });

  it("should get the correct variation by id", () => {
    const schema = new DataSchema({ test: { type: Number, id: true } });

    DataCache.registerVariations(schema, [
      { test: 1 },
      { test: 2 },
      { test: 3 },
    ]);

    const data = DataCache.getById(schema, 2);

    expect(data).toStrictEqual({ test: 2 });
  });

  it("should look for the next variation index", () => {
    const schema = new DataSchema({ test: Number });

    DataCache.registerVariations(schema, [
      { test: 1 },
      { test: 2 },
      { test: 3 },
    ]);

    const result = DataCache.lookForEmptyVariation(schema);

    expect(result).toBe(3);
  });

  it("should look for the next variation index (when there is space in between)", () => {
    const schema = new DataSchema({ test: Number });

    DataCache.saveVariation(schema, 0, { test: 1 });
    DataCache.saveVariation(schema, 3, { test: 2 });
    DataCache.saveVariation(schema, 10, { test: 3 });

    const result = DataCache.lookForEmptyVariation(schema);

    expect(result).toBe(11);
  });

  it("should look for the next variation index (should return zero if there isn't any entity cached)", () => {
    const schema = new DataSchema({ test: Number });

    const result = DataCache.lookForEmptyVariation(schema);

    expect(result).toBe(0);
  });
});
