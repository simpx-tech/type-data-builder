export type ISchema = Record<string, IFieldConfig | any>;

export interface ISchemaTweaks {
  // TODO show all possibilities
  exclude: string[];

  // TODO show all possibilities
  populate: string[];
  fields: ISchema;
}

export interface IFieldConfig {
  type: any | (() => any);
  id?: boolean;
  value?: any | (() => any);

  // TODO show all possibilities
  ref: string;
}
