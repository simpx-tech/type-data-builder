import { DataBuilder } from "./data-builder";
import { DataConfig } from "./data-config";

export class DataFactory {
  create(entity: string, config: { tweak?: string; variation?: number } = {}) {
    const schema = DataConfig.getSchema(entity);

    const builder = new DataBuilder(schema, config.variation ?? 0);

    if (config.tweak) {
      builder.to(config.tweak);
    }

    return builder;
  }
}
