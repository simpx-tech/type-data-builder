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

  variation: number;

  private data: Record<string, any> = {};

  constructor(readonly schema: DataSchema, variation: number = 0) {
    this.variation = variation;
    this.initializeData();
    this.saveVariation();
  }

  set(data: Record<string, any>) {
    this.data = { ...this.data, ...data };
    this.saveVariation();
  }

  setFull(data: Record<string, any>) {
    this.data = data;
    this.saveVariation();
  }

  // TODO Consider a schema which has two fields with the same entity (allow specify field instead of entity)
  connect(entity: DataSchema, variation?: number) {
    this.connector.connect(entity, variation);
  }

  var(newVariation: number) {
    this.setVariation(newVariation);
  }

  setVariation(newVariation: number) {
    this.variation = newVariation;

    const newVariationData = DataCache.getVariation(this.schema, newVariation);
    if (newVariationData) {
      this.data = newVariationData;
      this.saveVariation();
    } else {
      this.initializeData();
      this.saveVariation();
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

  private saveVariation() {
    DataCache.saveVariation(this.schema, this.variation, this.data);
  }
}
