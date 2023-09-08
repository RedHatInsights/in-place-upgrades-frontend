export const PERMISSIONS = {
  readHosts: 'inventory:hosts:read',
  useTasks: 'tasks:*:*',
};

export const SERVICES = {
  inventory: 'inventory',
  tasks: 'tasks',
};

export const INVENTORY_API_ROOT = '/api/inventory/v1';
export const INVENTORY_HOSTS_ROOT = '/hosts';
export const INVENTORY_TAGS_ROOT = '/tags';

export const TASKS_API_ROOT = '/api/tasks/v1';
export const TASKS_AVAILABLE_ROOT = '/task';
export const TASK_EXECUTED_ROOT = '/executed_task';

export const INFO_ALERT_SYSTEMS = 'Eligible systems include systems connected to console.redhat.com with rhc, or Satellite with Cloud Connector.';
