export const PERMISSIONS = {
  inventoryHostsRead: ['inventory:hosts:read'],
  tasks: ['tasks:*:*'],
  useRecommendations: ['advisor:*:*'],
  useRemediations: ['advisor:*:*'],
};

export const SERVICES = {
  inventory: 'inventory',
  tasks: 'tasks',
  advisor: 'advisor',
};

export const INVENTORY_API_ROOT = '/api/inventory/v1';
export const INVENTORY_HOSTS_ROOT = '/hosts';
export const INVENTORY_TAGS_ROOT = '/tags';

export const TASKS_API_ROOT = '/api/tasks/v1';
export const TASKS_AVAILABLE_ROOT = '/task';
export const TASK_EXECUTED_ROOT = '/executed_task';

export const RECOMMENDATIONS_API_ROOT = '/api/insights/v1';
export const RECOMMENDATIONS_RULES_ROOT = '/rule/';
export const RECOMMENDATIONS_DETAIL_ROOT = '/insights/advisor/recommendations';
export const RECOMMENDATIONS_SYSTEM_DETAILS = '/systems_detail/';

export const REMEDIATIONS_API_ROOT = '/api/remediations/v1';
export const REMEDIATIONS_RESOLUTIONS_ROOT = '/resolutions';
export const REMEDIATIONS_REMEDIATIONS_ROOT = '/remediations';
export const REMEDIATIONS_DETAIL_ROOT = '/insights/remediations';

export const INFO_ALERT_SYSTEMS = 'Eligible systems include systems connected to console.redhat.com with rhc, or Satellite with Cloud Connector.';
