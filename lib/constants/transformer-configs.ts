import { DateToStringConvertor } from "../convertors/date-to-string-convertor";
import { BsonIdToStringConvertor } from "../convertors/bson-id-to-string-convertor";
import { ITransformConfig } from "../interfaces/transform-config.interface";

export const inputTransformerConfig: ITransformConfig = {
  convertors: [new BsonIdToStringConvertor(), new DateToStringConvertor()],
  excludeFields: ["__v", "_id", "createdAt", "updatedAt"],
};

export const outputTransformerConfig: ITransformConfig = {
  convertors: [new BsonIdToStringConvertor(), new DateToStringConvertor()],
  excludeFields: ["__v"],
};
