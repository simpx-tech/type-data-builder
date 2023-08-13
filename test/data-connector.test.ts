import { ObjectId } from "bson";
import { DataBuilder } from "../lib/data-builder";
import { DataConnector } from "../lib/data-connector";
import { DataSchema } from "../lib/data-schema";
import { DataFactory } from "../lib/data-factory";
import { DataCache } from "../lib/data-cache";

describe("Data Connector", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    DataCache["cachedVariationsBySchema"] = new Map();
  });

  it("should fail if the given schema doesn't exists in the builder", () => {
    const schema2 = new DataSchema({ test3: String });
    const schema = new DataSchema({
      test: Boolean,
    });

    const builder = new DataBuilder(schema);

    const dataConnector = new DataConnector(builder);
    expect(() => dataConnector.connectWithVariation(schema2, 0)).toThrowError();
  });

  it("should connect a builder to a schema (and populate it)", () => {
    const schema2 = new DataSchema({
      _id: { id: true, type: ObjectId },
      test3: String,
    });

    const schema = new DataSchema({
      test: Boolean,
      test2: { type: ObjectId, ref: schema2 },
    });

    const builder = new DataBuilder(schema);
    const dataConnector = new DataConnector(builder);

    dataConnector.connectWithVariation(schema2, 0);

    expect(builder.raw()).toEqual({
      test: expect.any(Boolean),
      test2: {
        _id: expect.any(ObjectId),
        test3: expect.any(String),
      },
    });
  });

  it("should connect to a given entity", () => {
    const referencedSchema = new DataSchema({
      _id: { id: true, type: ObjectId },
      test3: String,
    });

    const schema = new DataSchema({
      test: Boolean,
      referenced: { type: ObjectId, ref: referencedSchema },
    });

    const builder = new DataBuilder(schema);
    const dataConnector = new DataConnector(builder);

    dataConnector.connect(referencedSchema);

    expect(builder.raw()).toEqual({
      test: expect.any(Boolean),
      referenced:
        DataCache["cachedVariationsBySchema"].get(referencedSchema)![0],
    });
  });

  it("should create a new entity if it the referenced entity doesn't exists (on connect)", () => {
    const referencedSchema = new DataSchema({
      _id: { id: true, type: ObjectId },
      test3: String,
    });

    const schema = new DataSchema({
      test: Boolean,
      referenced: { type: ObjectId, ref: referencedSchema },
    });

    const builder = new DataBuilder(schema);
    builder.set({ referenced: new ObjectId() });

    const dataConnector = new DataConnector(builder);

    dataConnector.connect(referencedSchema);

    expect(builder.raw()).toEqual({
      test: expect.any(Boolean),
      referenced:
        DataCache["cachedVariationsBySchema"].get(referencedSchema)![1],
    });
  });

  it("should set the id of the connected entity, by passing an id", () => {
    const schema = new DataSchema({ _id: { type: ObjectId, id: true } });
    const schema2 = new DataSchema({
      referenced: { type: ObjectId, ref: schema },
    });

    const builder = new DataBuilder(schema2);
    const customId = new ObjectId();

    const dataConnector = new DataConnector(builder);
    dataConnector.softConnect(schema, customId);

    expect(builder.raw()).toEqual({
      referenced: customId,
    });
  });

  it("should set the id of the connected entity, by passing an data builder", () => {
    const referencedSchema = new DataSchema({
      _id: { type: ObjectId, id: true },
    });
    const schema = new DataSchema({
      referenced: { type: ObjectId, ref: referencedSchema },
    });

    const referencedBuilder = new DataBuilder(referencedSchema);
    const builder = new DataBuilder(schema);

    const dataConnector = new DataConnector(builder);
    dataConnector.softConnect(referencedSchema, referencedBuilder);

    expect(referencedBuilder.raw()._id.toString()).toStrictEqual(
      builder.raw().referenced.toString()
    );
  });

  it("should create a new variation if it not exists (connectWithVariation)", () => {
    const referencedSchema = new DataSchema({
      _id: { type: ObjectId, id: true },
    });
    const schema = new DataSchema({
      referenced: { type: ObjectId, ref: referencedSchema },
    });

    new DataBuilder(referencedSchema);
    const builder = new DataBuilder(schema);
    const createSpy = jest.spyOn(DataFactory, "create");

    const dataConnector = new DataConnector(builder);
    dataConnector.connectWithVariation(referencedSchema, 1);

    expect(createSpy).toBeCalledTimes(1);
    expect(createSpy).toBeCalledWith(referencedSchema, { variation: 1 });
  });
});
