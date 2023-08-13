import { ObjectId } from "bson";
import { DataBuilder } from "../lib/data-builder";
import { DataCache } from "../lib/data-cache";
import { DataSchema } from "../lib/data-schema";
import {
  inputTransformerConfig,
  outputTransformerConfig,
} from "../lib/constants/transformer-configs";

describe("Data Builder", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    DataCache["cachedVariationsBySchema"] = new Map();
  });

  it("should create a new entity, initialize it's fields and save it's variation", () => {
    const schema = new DataSchema({ test: Number });
    const builder = new DataBuilder(schema);

    expect(builder.variation).toBe(0);
    expect(builder.raw()).toStrictEqual({ test: expect.any(Number) });

    expect(DataCache["cachedVariationsBySchema"].get(schema)).toStrictEqual([
      builder.raw(),
    ]);
  });

  it("should reuse data if the entity already exists", () => {
    const schema = new DataSchema({ test: Number });
    const builder = new DataBuilder(schema);
    const initialData = DataCache["cachedVariationsBySchema"].get(schema);

    const builder2 = new DataBuilder(schema);
    const builder1Data = builder.raw();

    expect(builder2.variation).toBe(0);
    expect(builder2.raw()).toStrictEqual(builder1Data);
    expect([builder2.raw()]).toStrictEqual(initialData);
  });

  it("should set certain fields of the entity", () => {
    const schema = new DataSchema({ test: Number, test2: String });
    const builder = new DataBuilder(schema);

    builder.set({ test: 12345 });

    expect(builder.raw()).toStrictEqual({
      test: 12345,
      test2: expect.any(String),
    });
  });

  it("should set all fields of the entity", () => {
    const schema = new DataSchema({ test: Number, test2: String });
    const builder = new DataBuilder(schema);

    builder.fullSet({ test: 12345, test2: "test", test3: true });

    expect(builder.raw()).toStrictEqual({
      test: 12345,
      test2: "test",
      test3: true,
    });
  });

  it("should call the DataConnector to connect", () => {
    const schema2 = new DataSchema({ _id: { type: ObjectId, id: true } });
    new DataBuilder(schema2);

    const schema = new DataSchema({
      test: Number,
      test2: { type: ObjectId, ref: schema2 },
    });
    const builder = new DataBuilder(schema);

    const connector = builder["connector"];
    const spy = jest
      .spyOn(connector, "connectWithVariation")
      .mockImplementation(() => {});

    builder.connect(schema2);

    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(schema2, undefined);
  });

  it("should change the entity's variation, if the entity doesn't exists, should initialize it", () => {
    const schema = new DataSchema({ test: Number });
    const builder = new DataBuilder(schema);

    builder.var(1);

    expect(builder.variation).toBe(1);
    expect(builder.raw()).toStrictEqual({ test: expect.any(Number) });

    expect(DataCache["cachedVariationsBySchema"].get(schema)![1]).toStrictEqual(
      builder.raw()
    );
  });

  it("should change the entity's variation, if the entity already exists, should reuse the cached variation", () => {
    const schema = new DataSchema({ test: Number });
    const builder = new DataBuilder(schema);
    const builder2 = new DataBuilder(schema, 1);

    builder.var(1);

    expect(builder.variation).toBe(1);
    expect(builder.raw()).toStrictEqual({ test: expect.any(Number) });

    expect(DataCache["cachedVariationsBySchema"].get(schema)![1]).toStrictEqual(
      builder2.raw()
    );
    expect(builder.raw()).toStrictEqual(builder2.raw());
  });

  it("should call the DataTransformer to transform to input", () => {
    const schema = new DataSchema({ test: Number });
    const builder = new DataBuilder(schema);

    const transformer = builder["transformer"];
    const spy = jest
      .spyOn(transformer, "transform")
      .mockImplementation(() => ({}));

    builder.toInput();

    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(inputTransformerConfig);
  });

  it("should call the DataTransformer to transform to output", () => {
    const schema = new DataSchema({ test: Number });
    const builder = new DataBuilder(schema);

    const transformer = builder["transformer"];
    const spy = jest
      .spyOn(transformer, "transform")
      .mockImplementation(() => ({}));

    builder.toOutput();

    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(outputTransformerConfig);
  });

  it("should call the DataTransformer to transform to custom format", () => {
    const schema = new DataSchema({ test: Number });
    const builder = new DataBuilder(schema);

    const customTransform = {
      excludeFields: [],
      convertors: [],
    };

    const transformer = builder["transformer"];
    const spy = jest
      .spyOn(transformer, "transform")
      .mockImplementation(() => ({}));

    builder.to(customTransform);

    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(customTransform);
  });

  it("should return the raw entity", () => {
    const schema = new DataSchema({
      test: Number,
      test2: String,
      test3: Boolean,
      test4: Date,
    });
    const builder = new DataBuilder(schema);

    const raw = builder.raw();

    expect(raw).toStrictEqual({
      test: expect.any(Number),
      test2: expect.any(String),
      test3: expect.any(Boolean),
      test4: expect.any(Date),
    });
  });
});
