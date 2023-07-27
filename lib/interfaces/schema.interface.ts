export type ISchema = Record<string, ISchemaConfig>;

export interface ISchemaConfig extends ISchemaConfigBase {
  tweaks?: Record<string, ISchemaConfigBase>;
}

export interface ISchemaConfigBase {
  type: any | (() => any);
  value?: any | (() => any);
}
