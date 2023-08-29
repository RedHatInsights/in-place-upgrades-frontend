import axios from 'axios';
import { INVENTORY_API_ROOT, INVENTORY_HOSTS_ROOT, INVENTORY_TAGS_ROOT } from './Helpers/constants';

export const fetchSystems = (path: string = '') => {
  return getInventory(INVENTORY_HOSTS_ROOT.concat(path));
};

export const fetchSystemsTags = (ids: string[], path: string = '') => {
  return getInventory(INVENTORY_HOSTS_ROOT.concat('/').concat(ids.join(',')).concat(INVENTORY_TAGS_ROOT).concat(path));
};

const getInventory = async (path: string) => {
  const response = await axios.get(INVENTORY_API_ROOT.concat(path)).catch(function (error) {
    return error;
  });

  return getResponseOrError(response);
};

const getResponseOrError = (response) => {
  if (response.status === 200) {
    return response.data;
  } else {
    return response;
  }
};
