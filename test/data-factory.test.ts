import { DataBuilder } from "../lib/data-builder";
import { DataConfig } from "../lib/data-config";
import { DataFactory } from "../lib/data-factory";
import { DataSchema } from "../lib/data-schema";

describe("DataFactory", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fail if the entity was not registered", () => {
    const entity = Symbol("entity");

    expect(() => DataFactory.create(entity)).toThrowError();
  });

  it("should create a new entity", () => {
    jest
      .spyOn(DataConfig, "getSchema")
      .mockImplementation(() => new DataSchema({ test: Boolean }) as any);

    const entity = Symbol("entity");

    const builder = DataFactory.create(entity);

    expect(builder).toBeInstanceOf(DataBuilder);
    expect(builder.schema.config).toStrictEqual({ test: Boolean });
    expect(builder.variation).toBe(0);
  });

  it("should pass the correct variation", () => {
    jest
      .spyOn(DataConfig, "getSchema")
      .mockImplementation(() => new DataSchema({ test: Boolean }) as any);

    const entity = Symbol("entity");

    const builder = DataFactory.create(entity, { variation: 2 });

    expect(builder).toBeInstanceOf(DataBuilder);
    expect(builder.schema.config).toStrictEqual({ test: Boolean });
    expect(builder.variation).toBe(2);
  });
});
