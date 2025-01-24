export interface BlockProperties {
  title?: [string[]];
  '=a>r'?: [string[], [['a', string]]];
  ICod?: [string[]];
  'L{b{'?: [string[]];
  cTXG?: [string[], [['d', { type: string; start_date: string }]]];
  dWBj?: [string[]];
  '~yj~'?: [string[]];
}

export interface NotionBlock {
  id: string;
  version: number;
  type: string;
  properties?: BlockProperties;
  created_time: number;
  last_edited_time: number;
  parent_id: string;
  parent_table: string;
  alive: boolean;
  space_id: string;
}

export interface RecordMap {
  block: {
    [key: string]: {
      value: NotionBlock;
      role: string;
    };
  };
}

export interface NotionQueryResponse {
  recordMap: RecordMap;
  allBlockIds: string[];
}
