export declare type SystemColumn = {
  key: string;
  sortKey?: string;
  props?: {
    width: number;
  };
  title: string;
  renderFunc?: (name: string, id: string) => JSX.Element;
};

export declare type SystemFilters = {
  hostnameOrId?: string;
  osFilter?: string[];
};
