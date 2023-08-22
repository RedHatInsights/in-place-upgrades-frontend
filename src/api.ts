import axios from 'axios';

export const TASKS_API_ROOT = '/api/tasks/v1';
export const SYSTEMS_ROOT = '/system';

export const fetchSystems = (path: string = '') => {
  return getTasks(SYSTEMS_ROOT.concat(path));
};

const getTasks = async (path: string) => {
  const response = await axios.get(TASKS_API_ROOT.concat(path)).catch(function (error) {
    return error;
  });

  if (response.status === 200) {
    return response.data;
  } else {
    return response;
  }
};
