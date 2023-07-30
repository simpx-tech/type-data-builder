import { DataBuilder } from "./data-builder";
import { DataConfig } from "./data-config";
import { IDataFactoryConfig } from "./interfaces/data-factory-config.interface";

export class DataFactory {
  create(entity: Symbol, config: IDataFactoryConfig = {}) {
    const schema = DataConfig.getSchema(entity);

    if (!schema) {
      throw new Error(
        `The provided doesn't was registered. Use DataConfig.registerSchema(schema) to register it.`
      );
    }

    const builder = new DataBuilder(schema, config.variation);

    return builder;
  }
}
