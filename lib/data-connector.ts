import { ObjectId } from "bson";
import { DataBuilder } from "./data-builder";
import { DataCache } from "./data-cache";
import { DataFactory } from "./data-factory";
import { DataSchema } from "./data-schema";
import { IFieldConfig } from "./interfaces";
import { isDict } from "./utils/is-dict";

export class DataConnector {
  constructor(private builder: DataBuilder) {}

  softConnect(entity: DataSchema, idOrDataBuilder: ObjectId | DataBuilder) {
    let finalId: ObjectId;
    if (idOrDataBuilder instanceof ObjectId) {
      finalId = idOrDataBuilder;
    } else {
      const idField = DataSchema.getIdField(entity);

      finalId = idOrDataBuilder.raw()[idField];
    }

    this.forEachConfigField((field, fieldConfig, done) => {
      if (fieldConfig.ref === entity) {
        this.builder.set({ [field]: finalId });
        done();
      }
    });
  }

  connect(entity: DataSchema) {
    this.forEachConfigField((field, fieldConfig, done) => {
      if (fieldConfig.ref === entity) {
        const id = this.builder.raw()[field];
        let data = DataCache.getById(entity, id.toString());

        if (!data) {
          const emptyVariation = DataCache.lookForEmptyVariation(entity);
          data = DataFactory.create(entity, {
            variation: emptyVariation,
          }).raw();
        }

        this.builder.set({ [field]: data });
        done();
      }
    });
  }

  connectWithVariation(entity: DataSchema, variation = 0) {
    const wasDone = this.forEachConfigField((field, fieldConfig, done) => {
      if (fieldConfig.ref === entity) {
        let data = DataCache.getVariation(entity, variation);

        if (!data) {
          data = DataFactory.create(entity, { variation }).raw();
        }

        this.builder.set({ [field]: data });

        done();
      }
    });

    if (!wasDone) {
      throw new Error(
        `This schema has no relation to the builder schema (the builder schema doesn't has any ${entity.constructor.name} schema)`
      );
    }
  }

  private forEachField(
    callback: (field: string, fieldType: any, done: Function) => void
  ) {
    let hasDone = false;
    const builderFields = Object.entries(this.builder.schema.config);

    for (const [field, fieldType] of builderFields) {
      const done = () => {
        hasDone = true;
        return;
      };

      callback(field, fieldType, done);
    }

    return hasDone;
  }

  private forEachConfigField(
    callback: (field: string, fieldConfig: IFieldConfig, done: Function) => void
  ) {
    return this.forEachField((field, fieldType, done) => {
      if (isDict(fieldType)) {
        const fieldConfig = fieldType as IFieldConfig;
        callback(field, fieldConfig, done);
      }
    });
  }
}
