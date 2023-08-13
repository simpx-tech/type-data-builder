import { DataSchema } from "../lib/data-schema";

describe("Data Schema", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fail to get id field if it was not set", () => {
    const schema = new DataSchema({ test: Boolean });

    expect(() => DataSchema.getIdField(schema)).toThrow(
      "No id field was set. Set a field with id: true on the schema to use this"
    );
  });

  it("should get the id field", () => {
    const schema = new DataSchema({
      test: Boolean,
      test2: Number,
      test3: String,
      test4: Date,
      test5: { id: true, type: Number },
    });

    expect(DataSchema.getIdField(schema)).toBe("test5");
  });
});
