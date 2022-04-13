export type NodeValueData = Text[];

export type TextByVariable = {
    [variable: string]: [Text, string];
}

export type ValueData = {
    name: string,
    value: any,
}

export type TrackedData = {
    [key: string] : ValueData,
}

export type MapNodes = Map<any, NodeValueData[]>;