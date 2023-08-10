import { ObjectId } from "bson";
import { DataBuilder } from "../lib/data-builder";
import { DataConfig } from "../lib/data-config";
import { DataConnector } from "../lib/data-connector";
import { DataSchema } from "../lib/data-schema";

describe("Data Connector", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fail if the given schema doesn't exists in the builder", () => {
    const schema2 = new DataSchema({ test3: String });
    const schema = new DataSchema({
      test: Boolean,
    });

    DataConfig.registerSchema(schema).registerSchema(schema2);

    const builder = new DataBuilder(schema);

    const dataConnector = new DataConnector(builder);
    expect(dataConnector.connect(schema2, 0)).toThrowError();
  });

  it("should connect a builder to a schema", () => {
    const schema2 = new DataSchema({ test3: String });

    const schema = new DataSchema({
      test: Boolean,
      test2: { type: ObjectId, ref: schema2 },
    });

    DataConfig.registerSchema(schema).registerSchema(schema2);

    const builder = new DataBuilder(schema);
    const dataConnector = new DataConnector(builder);

    dataConnector.connect(schema2, 0);

    expect(builder.toOutput()).toEqual({
      test: expect.any(Boolean),
      test2: {
        test3: expect.any(String),
      },
    });
  });
});
