export type NodeValueData = [Text, (string | null), number, ValueData?];

export type ValueData = {
    name: string,
    value: any,
    nodes: NodeValueData[],
}

export type TrackedData = {
    [key: string] : ValueData,
}

export type MapNodes = Map<any, NodeValueData[]>;