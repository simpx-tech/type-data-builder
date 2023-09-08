import { BSON, ObjectId } from "bson";
import { IDataConvertor } from "../interfaces";

export class BsonIdToStringConvertor
  implements IDataConvertor<string, ObjectId>
{
  isToConvert(input: unknown) {
    if (Array.isArray(input)) {
      return false;
    }

    if (input?.toString) {
      const inputString = input.toString();
      return BSON.ObjectId.isValid(inputString);
    }

    return false;
  }

  convert(input: ObjectId) {
    return input.toString();
  }
}
