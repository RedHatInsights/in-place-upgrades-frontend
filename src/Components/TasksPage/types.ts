export declare type TaskInfo = {
  slug: string;
  title: string;
  type: string;
  description: string;
  publish_date: string;
  parameters: string[];
};

export declare type ExecutedTask = {
  id: number;
  task_slug: string;
  task_title: string;
  task_description: string;
  initiated_by: string;
  start_time: string;
  end_time: string;
  status: string;
  systems_count: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  details?: any;
};
