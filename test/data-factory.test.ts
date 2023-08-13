import { DataBuilder } from "../lib/data-builder";
import { DataFactory } from "../lib/data-factory";
import { DataSchema } from "../lib/data-schema";

describe("DataFactory", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a new entity", () => {
    const schema = new DataSchema({ test: Boolean });

    const builder = DataFactory.create(schema);

    expect(builder).toBeInstanceOf(DataBuilder);
    expect(builder.schema.config).toStrictEqual({ test: Boolean });
    expect(builder.variation).toBe(0);
  });

  it("should pass the correct variation", () => {
    const schema = new DataSchema({ test: Boolean });

    const builder = DataFactory.create(schema, { variation: 2 });

    expect(builder).toBeInstanceOf(DataBuilder);
    expect(builder.schema.config).toStrictEqual({ test: Boolean });
    expect(builder.variation).toBe(2);
  });
});
