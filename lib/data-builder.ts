import {
  inputTransformerConfig,
  outputTransformerConfig,
} from "./constants/transformer-configs";
import { DataCache } from "./data-cache";
import { DataConnector } from "./data-connector";
import { DataGenerator } from "./data-generator";
import { DataSchema } from "./data-schema";
import { DataTransformer } from "./data-transformer";

export class DataBuilder {
  private generator = new DataGenerator(this);
  private connector = new DataConnector(this);
  private transformer = new DataTransformer(this);

  variation: number = 0;

  private data: Record<string, any> = {};

  constructor(readonly schema: DataSchema, variation: number = 0) {
    this.setVariation(variation);
  }

  set(data: Record<string, any>) {
    this.data = { ...this.data, ...data };
    this.saveOnCache();
  }

  fullSet(data: Record<string, any>) {
    this.data = data;
    this.saveOnCache();
  }

  // TODO Consider a schema which has two fields with the same entity (allow specify field instead of entity)
  connect(entity: DataSchema, variation?: number) {
    this.connector.connectWithVariation(entity, variation);
  }

  var(newVariation: number) {
    this.setVariation(newVariation);
  }

  setVariation(newVariation: number) {
    this.variation = newVariation;

    const variationInCache = DataCache.getVariation(this.schema, newVariation);
    if (variationInCache) {
      this.data = variationInCache;
    } else {
      this.initializeData();
      this.saveOnCache();
    }
  }

  toInput() {
    const inputConfig = inputTransformerConfig;
    return this.transformer.transform(inputConfig);
  }

  toOutput() {
    const outputConfig = outputTransformerConfig;
    return this.transformer.transform(outputConfig);
  }

  raw() {
    return this.data;
  }

  private initializeData() {
    return this.generator.generate();
  }

  private saveOnCache() {
    DataCache.saveVariation(this.schema, this.variation, this.data);
  }
}
