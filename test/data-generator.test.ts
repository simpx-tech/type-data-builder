import { ObjectId } from "bson";
import { DataBuilder } from "../lib/data-builder";
import { DataGenerator } from "../lib/data-generator";
import { DataSchema } from "../lib";
import { DataCache } from "../lib/data-cache";
import {SpecialType} from "../lib/enums/special-types.enum";

describe("Data Generator", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    DataCache["cachedVariationsBySchema"] = new Map();
  });

  it("should generate all values for the schema fields", () => {
    const builder = new DataBuilder(
      new DataSchema({
        test: Boolean,
        test2: String,
        test3: Number,
        test4: Date,
      })
    );

    const generator = new DataGenerator(builder);

    generator.generate();

    expect(builder.raw()).toStrictEqual({
      test: expect.any(Boolean),
      test2: expect.any(String),
      test3: expect.any(Number),
      test4: expect.any(Date),
    });
  });

  it("should generate a referenced entity if it not exists yet", () => {
    const referencedSchema = new DataSchema({
      _id: { type: SpecialType.ObjectId, id: true },
    });
    const schema = new DataSchema({
      referenced: { type: SpecialType.ObjectId, ref: referencedSchema },
    });

    new DataBuilder(schema);

    expect(DataCache.getVariation(referencedSchema, 0)).toBeTruthy();
  });

  it("should generate a ObjectId for the ref field, and it should be equal to the first variation", () => {
    const referencedSchema = new DataSchema({
      _id: { id: true, type: SpecialType.ObjectId },
      test: Boolean,
    });
    const referencedBuilder = new DataBuilder(referencedSchema);

    const builder = new DataBuilder(
      new DataSchema({
        test: {
          type: SpecialType.ObjectId,
          ref: referencedSchema,
        },
      })
    );

    const generator = new DataGenerator(builder);
    generator.generate();

    expect(builder.raw()).toStrictEqual({
      test: expect.any(ObjectId),
    });
    expect(builder.raw().test).toStrictEqual(referencedBuilder.raw()._id);
  });

  it("should generate fields for a schema field", () => {
    const nestedSchema = new DataSchema({
      test: Boolean,
      test2: Number,
      test3: String,
      test4: Date,
    });

    const builder = new DataBuilder(
      new DataSchema({
        testNested: {
          type: nestedSchema,
        },
      })
    );

    const generator = new DataGenerator(builder);
    generator.generate();

    expect(builder.raw()).toStrictEqual({
      testNested: {
        test: expect.any(Boolean),
        test2: expect.any(Number),
        test3: expect.any(String),
        test4: expect.any(Date),
      },
    });
  });

  it("should generate an array of one item if the field is an array", () => {
    const builder = new DataBuilder(
      new DataSchema({
        test: [Number],
      })
    );

    const generator = new DataGenerator(builder);
    generator.generate();

    expect(builder.raw()).toStrictEqual({
      test: [expect.any(Number)],
    });
  });

  it("should generate an array of nested schemas", () => {
    const builder = new DataBuilder(
      new DataSchema({
        test: [
          {
            type: new DataSchema({
              test: Boolean,
              test2: Number,
              test3: String,
              test4: Date,
            }),
          },
        ],
      })
    );

    const generator = new DataGenerator(builder);
    generator.generate();

    expect(builder.raw()).toStrictEqual({
      test: [
        {
          test: expect.any(Boolean),
          test2: expect.any(Number),
          test3: expect.any(String),
          test4: expect.any(Date),
        },
      ],
    });
  });

  it("should use the user provided value", () => {
    const builder = new DataBuilder(
      new DataSchema({
        test: {
          type: Number,
          value: 12345,
        },
      })
    );

    const generator = new DataGenerator(builder);
    generator.generate();

    expect(builder.raw()).toStrictEqual({
      test: 12345,
    });
  });

  it("should generate a value based on the user provided factory function", () => {
    const builder = new DataBuilder(
      new DataSchema({
        test: {
          type: Number,
          value: () => 12345,
        },
      })
    );

    const generator = new DataGenerator(builder);
    generator.generate();

    expect(builder.raw()).toStrictEqual({
      test: 12345,
    });
  });

  it("should generate nested objects", () => {
    const nestedSchema = new DataSchema({
      test: Number,
    })

    const rootSchema = new DataSchema({
      rootTest: {
        type: nestedSchema
      }
    })

    const builder = new DataBuilder(rootSchema);

    const generator = new DataGenerator(builder);
    generator.generate();

    expect(builder.raw()).toStrictEqual({
      rootTest: {
        test: expect.any(Number)
      },
    });
  });

  it("should generate array of nested objects", () => {
    const nestedSchema = new DataSchema({
      test: Number,
    })

    const rootSchema = new DataSchema({
      rootTest: {
        type: [nestedSchema]
      }
    })

    const builder = new DataBuilder(rootSchema);

    const generator = new DataGenerator(builder);
    generator.generate();

    expect(builder.raw()).toStrictEqual({
      rootTest: [{
        test: expect.any(Number)
      }],
    });
  });
});
