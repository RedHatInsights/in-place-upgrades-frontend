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
  osFilter?: string[];
};
