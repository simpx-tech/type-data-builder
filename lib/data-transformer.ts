import omit from "lodash.omit";
import { DataBuilder } from "./data-builder";
import { ITransformConfig } from "./interfaces";
import { isDict } from "./utils/is-dict";

export class DataTransformer {
  constructor(private readonly builder: DataBuilder) {}

  transform(config: ITransformConfig) {
    this.excludeFields(config.excludeFields);

    const fields = Object.entries(this.builder.raw());
    return fields.reduce<Record<string, any>>((acc, [field, value]) => {
      acc[field] = this.transformField(config, field, value);
      return acc;
    }, {});
  }

  private transformField(config: ITransformConfig, field: string, value: any) {
    for (const convertor of config.convertors) {
      if (convertor.isToConvert(value)) {
        return convertor.convert(value);
      }
    }

    if (typeof value === "object") {
      if (Array.isArray(value)) {
        return this.transformArray(config, field, value);
      } else if (isDict(value)) {
        return this.transformObject(config, field, value);
      }
    }

    return value;
  }

  private transformArray(
    config: ITransformConfig,
    field: string,
    value: any[],
  ): any[] {
    return value.map((item, index) => {
      return this.transformField(config, `${field}.${index}`, item);
    });
  }

  private transformObject(
    config: ITransformConfig,
    field: string,
    value: Record<string, any>,
  ): Record<string, any> {
    return Object.entries(value).reduce<Record<string, any>>(
      (acc, [key, value]) => {
        acc[key] = this.transformField(config, `${field}.${key}`, value);
        return acc;
      },
      {},
    );
  }

  private excludeFields(fields: string[]) {
    this.builder.fullSet(omit(this.builder.raw(), fields));
  }
}
