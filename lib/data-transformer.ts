import omit from "lodash.omit";
import { DataBuilder } from "./data-builder";
import { ITransformConfig } from "./interfaces/transform-config.interface";

export class DataTransformer {
  constructor(private readonly builder: DataBuilder) {}

  transform(config: ITransformConfig) {
    this.excludeFields(config.excludeFields);

    const fields = Object.entries(this.builder.raw());
    const convertedFields = fields.map(([field, value]) => {
      return this.transformField(config, field, value);
    });

    this.builder.setFull(convertedFields);
  }

  transformField(config: ITransformConfig, field: string, value: any) {
    for (const convertor of config.convertors) {
      if (convertor.isToConvert(value)) {
        return convertor.convert(value);
      }
    }

    if (typeof value === "object") {
      if (Array.isArray(value)) {
        return this.transformArray(config, field, value);
        // Have sure that the object is a dictionary
      } else if (value.constructor == Object) {
        return this.transformObject(config, field, value);
      }
    }
  }

  transformArray(config: ITransformConfig, field: string, value: any[]): any[] {
    return value.map((item, index) => {
      return this.transformField(config, `${field}.${index}`, item);
    });
  }

  transformObject(
    config: ITransformConfig,
    field: string,
    value: Record<string, any>
  ): Record<string, any> {
    return Object.entries(value).map(([key, value]) => {
      return this.transformField(config, `${field}.${key}`, value);
    });
  }

  excludeFields(fields: string[]) {
    this.builder.setFull(omit(this.builder.raw(), fields));
  }
}
