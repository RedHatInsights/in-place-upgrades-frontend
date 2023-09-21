import axios from 'axios';
import { AxiosResponse } from 'axios';

import {
  INVENTORY_API_ROOT,
  INVENTORY_HOSTS_ROOT,
  INVENTORY_TAGS_ROOT,
  TASK_EXECUTED_ROOT,
  TASKS_API_ROOT,
  TASKS_AVAILABLE_ROOT,
} from './Helpers/constants';

/* Inventory */

export const inventoryFetchSystems = (path: string = '') => {
  return getInventory(INVENTORY_HOSTS_ROOT.concat(path));
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
