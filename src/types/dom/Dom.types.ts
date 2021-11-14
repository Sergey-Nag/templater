import { NodeValueData } from "../data/Data.type";

export type CollectedVarData = {
  [variable: string] : [Text, string][];
};

export type CollectedAttrData = {
  [attr: string] : Attr[]
};

export type ExpressionData = {
  node: Text,
  hasVariables: boolean;
  variables?: CollectedVarData[];
};

export type CollectedExpData = {
  [expression: string] : ExpressionData[];
};

export type CollectedDataFromDOM = {
  variables: CollectedVarData;
  expressions?: CollectedVarData;
  directives?: CollectedAttrData;
}