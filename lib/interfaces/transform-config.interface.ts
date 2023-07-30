import { IDataConvertor } from "./data-convertor.interface";

export interface ITransformConfig {
  excludeFields: string[];
  convertors: IDataConvertor[];
}
