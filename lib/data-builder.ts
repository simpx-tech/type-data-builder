import { ISchema } from "./interfaces/schema.interface";

export class DataBuilder {
  private data: Record<string, any> = {};
  private cachedVariationsByTweakByEntity = new Map<
    string,
    Map<string, Record<number, any>>
  >();

  constructor(readonly schema: ISchema, private variation: number) {}

  set(data: Record<string, any>) {}

  connect(entity: DataBuilder) {}

  setVariation(newVariation: number) {
    this.variation = newVariation;
  }

  toOutput() {}

  toInput() {}

  to(tweak: string) {}

  build() {
    return this.data;
  }
}
