import { DataConfig } from "../lib/data-config";
import { DataSchema } from "../lib/data-schema";

describe("Data Config", () => {
  let originalSchemas: Map<Symbol, DataSchema>;

  beforeEach(() => {
    originalSchemas = new Map((DataConfig as any)?.schemas ?? []);

    jest.clearAllMocks();
  });

  afterEach(() => {
    (DataConfig as any).schemas = originalSchemas;
  });

  it("should register a schema", () => {
    const schema = new DataSchema({ test: Boolean });

    DataConfig.registerSchema(schema);

    expect((DataConfig as any)?.schemas?.has?.(schema)).toBeTruthy();
  });
});
