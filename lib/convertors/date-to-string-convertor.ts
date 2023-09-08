import { IDataConvertor } from "../interfaces";

export class DateToStringConvertor implements IDataConvertor {
  isToConvert(input: unknown): boolean {
    return input instanceof Date;
  }

  convert(value: any) {
    return value.toISOString();
  }
}
