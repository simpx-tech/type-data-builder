import { BSON, ObjectId } from "bson";
import { IDataConvertor } from "../interfaces/data-convertor.interface";

export class BsonIdToStringConvertor
  implements IDataConvertor<string, ObjectId>
{
  isToConvert(input: unknown) {
    if (input?.toString) {
      const inputString = input.toString();
      const isId = BSON.ObjectId.isValid(inputString);

      return isId;
    }

    return false;
  }

  convert(input: ObjectId) {
    return input.toString();
  }
}
