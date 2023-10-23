export declare type SystemColumn = {
  key: string;
  sortKey?: string;
  props?: {
    width: number;
  };
  title: string;
  renderFunc?: (value, id: string) => JSX.Element;
};

export declare type SystemFilters = {
  hostnameOrId?: string;
  osFilter?: {
    osName: string;
    osGroup: string;
    value: string;
  }[];
};

export declare type FetchedEntities = {
  results?: Array<{
    id: string;
  }>;
  total?: number;
};
