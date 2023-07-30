import { IDataEngine } from "../interfaces/data-engine.interface";
import { ISchemaTweaks } from "../interfaces/schema.interface";
import { BaseEngine } from "./base-engine";

export class MongoEngine extends BaseEngine implements IDataEngine {
  getTweaks(): Record<string, ISchemaTweaks> {
    return {
      input: {
        exclude: ["_id", "__v", "updatedAt", "createdAt"],
        populate: [],
        fields: {},
      },
      output: {
        exclude: [],
        populate: [],
        fields: {},
      },
    };
  }
}
