import {
  inputTransformerConfig,
  outputTransformerConfig,
} from "../lib/constants/transformer-configs";
import { DataBuilder } from "../lib/data-builder";
import { DataSchema } from "../lib";
import { DataTransformer } from "../lib/data-transformer";
import {SpecialType} from "../lib/enums/special-types.enum";

describe("Data Transformer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should transform the entity to input", () => {
    const builder = new DataBuilder(
      new DataSchema({
        __v: Number,
        _id: {
          id: true,
          type: SpecialType.ObjectId,
        },
        createdAt: Date,
        updatedAt: Date,
        otherField: String,
        fieldToSkipTransform: Object.create(null),
      })
    );
    const transformer = new DataTransformer(builder);

    const input = transformer.transform(inputTransformerConfig);

    expect(input).toStrictEqual({
      otherField: expect.any(String),
      fieldToSkipTransform: undefined,
    });
  });

  it("should transform the entity to output", () => {
    const builder = new DataBuilder(
      new DataSchema({
        __v: Number,
        _id: {
          id: true,
          type: SpecialType.ObjectId,
        },
        createdAt: Date,
        updatedAt: Date,
        otherField: String,
      })
    );
    const transformer = new DataTransformer(builder);

    const input = transformer.transform(outputTransformerConfig);

    expect(input).toStrictEqual({
      _id: expect.any(String),
      otherField: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  it("should transform nested schemas", () => {
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

    const transformer = new DataTransformer(builder);
    const output = transformer.transform(outputTransformerConfig);

    expect(output).toStrictEqual({
      testNested: {
        test: expect.any(Boolean),
        test2: expect.any(Number),
        test3: expect.any(String),
        test4: expect.any(String),
      },
    });
  });

  it("should transform arrays", () => {
    const builder = new DataBuilder(
      new DataSchema({
        test: [Date],
      })
    );

    const transformer = new DataTransformer(builder);
    const output = transformer.transform(outputTransformerConfig);

    expect(output).toStrictEqual({
      test: [expect.any(String)],
    });
  });

  it("should transform arrays of nested schemas", () => {
    const nestedSchema = new DataSchema({
      test: Boolean,
      test2: Number,
      test3: String,
      test4: Date,
    });

    const builder = new DataBuilder(
      new DataSchema({
        testNestedArray: {
          type: [nestedSchema],
        },
      })
    );

    const transformer = new DataTransformer(builder);
    const output = transformer.transform(outputTransformerConfig);

    expect(output).toStrictEqual({
      testNestedArray: [
        {
          test: expect.any(Boolean),
          test2: expect.any(Number),
          test3: expect.any(String),
          test4: expect.any(String),
        },
      ],
    });
  });
});
