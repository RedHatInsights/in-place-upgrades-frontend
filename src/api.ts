import axios from 'axios';
import { AxiosResponse } from 'axios';

import {
  INVENTORY_API_ROOT,
  INVENTORY_HOSTS_ROOT,
  INVENTORY_TAGS_ROOT,
  RECOMMENDATIONS_API_ROOT,
  RECOMMENDATIONS_RULES_ROOT,
  RECOMMENDATIONS_SYSTEM_DETAILS,
  REMEDIATIONS_API_ROOT,
  REMEDIATIONS_REMEDIATIONS_ROOT,
  REMEDIATIONS_RESOLUTIONS_ROOT,
  TASK_EXECUTED_ROOT,
  TASKS_API_ROOT,
  TASKS_AVAILABLE_ROOT,
} from './Helpers/constants';

/* Inventory */

export const inventoryFetchSystems = (path: string = '') => {
  return getInventory(INVENTORY_HOSTS_ROOT.concat(path));
};

export const inventoryFetchSystemsByIds = (ids: string[], path: string = '') => {
  return getInventory(INVENTORY_HOSTS_ROOT.concat('/').concat(ids.join(',')).concat(path));
};

export const inventoryFetchSystemsTags = (ids: string[], path: string = '') => {
  return getInventory(INVENTORY_HOSTS_ROOT.concat('/').concat(ids.join(',')).concat(INVENTORY_TAGS_ROOT).concat(path));
};

const getInventory = async (path: string) => {
  const response = await axios.get(INVENTORY_API_ROOT.concat(path)).catch(function (error) {
    return error;
  });

  return getResponseOrError(response);
};

/* Tasks */

const getTasks = async (path: string) => {
  const response = await axios.get(TASKS_API_ROOT.concat(path)).catch(function (error) {
    return error;
  });

  return getResponseOrError(response);
};

export const tasksFetchExecutedTasks = (slug: string = '', path: string = '') => {
  return getTasks(TASK_EXECUTED_ROOT.concat(`?text=${slug}`).concat(path));
};

export const tasksFetchExecutedTaskDetail = (id: string) => {
  return getTasks(TASK_EXECUTED_ROOT.concat(`/${id}`));
};

export const tasksFetchTaskInfo = (slug: string = '') => {
  return getTasks(TASKS_AVAILABLE_ROOT.concat(`/${slug}`));
};

export const tasksExecuteTask = (body) => {
  return postTask(TASK_EXECUTED_ROOT, body);
};

const postTask = async (path, data) => {
  const response = await axios.post(TASKS_API_ROOT.concat(path), data).catch(function (error) {
    return error;
  });

  return getResponseOrError(response);
};

/* Recommendations */

export const getRecommendations = async (path: string) => {
  const response = await axios.get(RECOMMENDATIONS_API_ROOT.concat(path)).catch(function (error) {
    return error;
  });

  return getResponseOrError(response);
};

export const recommendationsFetch = (page: number, perPage: number, sort: string) => {
  const offset = (page - 1) * perPage;
  return getRecommendations(RECOMMENDATIONS_RULES_ROOT.concat(`?has_tag=leapp&impacting=true&sort=${sort}&limit=${perPage}&offset=${offset}`));
};

export const recommendationsAffectedSystems = (ruleId: string, path: string = '') => {
  return getRecommendations(RECOMMENDATIONS_RULES_ROOT.concat(`${ruleId}`).concat(RECOMMENDATIONS_SYSTEM_DETAILS).concat(path));
};

/* Remediations */

const getRemediations = async (path: string) => {
  const response = await axios.get(REMEDIATIONS_API_ROOT.concat(path)).catch(function (error) {
    return error;
  });

  return getResponseOrError(response);
};

const postRemediations = async (path: string, data) => {
  const response = await axios.post(REMEDIATIONS_API_ROOT.concat(path), data).catch(function (error) {
    return error;
  });

  return getResponseOrError(response);
};

export const remediationsFetch = (page: number, perPage: number, sort: string, hide_arhived: boolean = true) => {
  const offset = (page - 1) * perPage;
  return getRemediations(REMEDIATIONS_REMEDIATIONS_ROOT.concat(`?sort=${sort}&limit=${perPage}&offset=${offset}&hide_archived=${hide_arhived}`));
};

export const remediationsResolutions = (ruleId: string) => {
  return postRemediations(REMEDIATIONS_RESOLUTIONS_ROOT, {
    issues: [`advisor:${ruleId}`],
  });
};

export const remedationsCreate = (name: string, ruleId: string, systems: string[], auto_reboot: boolean = false) => {
  return postRemediations(REMEDIATIONS_REMEDIATIONS_ROOT, {
    add: {
      issues: [
        {
          id: `advisor:${ruleId}`,
          resolution: 'fix',
          systems: systems,
        },
      ],
      systems: [],
    },
    auto_reboot: auto_reboot,
    name: name,
  });
};

/* Common functions */

const getResponseOrError = (response: AxiosResponse) => {
  if (response.status === 200) {
    return response.data;
  } else {
    return response;
  }
};

export const isError = (result) => {
  const statusString = result?.response?.status.toString();
  return result?.response?.status && statusString[0] !== '2';
};
