import omit from "lodash.omit";
import { DataBuilder } from "./data-builder";
import { ITransformConfig } from "./interfaces";
import { isDict } from "./utils/is-dict";
import { deepCopy } from "./utils/deep-copy";

export class DataTransformer {
  constructor(private readonly builder: DataBuilder) {}

  transform(config: ITransformConfig) {
    const objCopy = deepCopy(this.builder.raw());

    const objWithoutFields = this.excludeFields(objCopy, config.excludeFields);

    const fields = Object.entries(objWithoutFields);
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
        // TODO "field" doesn't seem to be used, and so, to be relevant
        return this.transformArray(config, field, value);
      } else if (isDict(value)) {
        // TODO "field" doesn't seem to be used, and so, to be relevant
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

  private excludeFields(objCopy: Record<string, any>, fields: string[]) {
    return omit(objCopy, fields);
  }
}
