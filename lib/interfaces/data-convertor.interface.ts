export interface IDataConvertor<TOutput = any, TInput = any> {
  isToConvert(input: unknown): boolean;
  convert(input: TInput): TOutput;
}
