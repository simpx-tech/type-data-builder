import { DataConnector } from "./data-connector";
import { DataGenerator } from "./data-generator";
import { ISchema, ISchemaTweaks } from "./interfaces/schema.interface";

export class DataBuilder {
  private data: Record<string, any> = {};
  private cachedVariationsByTweakByEntity = new Map<
    string,
    Map<string, Record<number, any>>
  >();

  private generator = new DataGenerator(this);
  private connector = new DataConnector(this);

  constructor(readonly schema: ISchema, private variation: number) {
    this.initializeData();
  }

  private initializeData() {
    return this.generator.generate();
    // .forEach((entity) => {
    //   this.data[entity.name] = {};
    //   this.cachedVariationsByTweakByEntity.set(entity.name, new Map());
    // });
  }

  set(data: Record<string, any>) {
    this.data = { ...this.data, ...data };
  }

  populate(entity: DataBuilder) {
    this.connector.connect(entity);
  }

  setVariation(newVariation: number) {
    this.variation = newVariation;
  }

  toInput(extraConfig?: ISchemaTweaks) {}

  toOutput(extraConfig?: ISchemaTweaks) {}

  to(tweak: string, extraConfig?: ISchemaTweaks) {}

  clone() {
    return new DataBuilder(this.schema, this.variation);
  }

  raw() {
    return this.data;
  }
}
