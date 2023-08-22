import React from 'react';
import { entitiesReducer } from '../../store/index';
import { SystemColumn, SystemFilters } from './types';
import ReducerRegistry from '@redhat-cloud-services/frontend-components-utilities/ReducerRegistry';
import { Reducer } from 'redux';

const buildSortString = (orderBy: string, orderDirection: string): string => {
  const sortString = orderBy ? '&sort=' : '';
  let direction = '';
  if (orderDirection === 'DESC') {
    direction = '-';
  }
  const order = orderBy === 'updated' ? 'last_seen' : orderBy;

  return `${sortString}${direction}${order}`;
};

const buildFilterString = (filters: SystemFilters): string => {
  const displayNameFilter = filters.hostnameOrId ? `&display_name=${filters.hostnameOrId}` : '';

  const osFilter = filters.osFilter?.length ? '&os_version=' + filters.osFilter.join(',') : '';

  return `${displayNameFilter}${osFilter}`;
};

export const buildFilterSortString = (limit: number, offset: number, orderBy: string, orderDirection: string, filters: SystemFilters) => {
  const limitOffsetString = `limit=${limit}&offset=${offset}`;
  const sortString = buildSortString(orderBy, orderDirection);
  const filterString = buildFilterString(filters);
  return `?${limitOffsetString}${sortString}${filterString}`;
};

export const findCheckedValue = (total: number, selected: number): boolean | null => {
  if (selected === total && total > 0) {
    return true;
  } else if (selected > 0 && selected < total) {
    return null;
  } else {
    return false;
  }
};

const createSystemLink = (id: string, name: string, keyData: string, isBetaEnv: boolean): JSX.Element => (
  <a rel="noreferrer" target="_blank" key={keyData} href={isBetaEnv ? `/preview/insights/inventory/${id}` : `/insights/inventory/${id}`}>
    {name}
  </a>
);

export const systemColumns = (isBeta: boolean): SystemColumn[] => [
  {
    key: 'display_name',
    sortKey: 'display_name',
    props: { width: 20 },
    title: 'Name',
    renderFunc: (name, id) => {
      return createSystemLink(id, name, `system-name-${id}`, isBeta);
    },
  },
  {
    key: 'tags',
    title: 'Tags',
  },
  {
    key: 'os_version',
    sortKey: 'os_version',
    props: { width: 10 },
    title: 'OS',
  },
  {
    key: 'updated',
    title: 'updated',
  },
];

export const defaultOnLoad = (columns, getRegistry: () => ReducerRegistry<Reducer>) => {
  return ({ INVENTORY_ACTION_TYPES, mergeWithEntities }) =>
    getRegistry().register({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      ...mergeWithEntities(entitiesReducer(INVENTORY_ACTION_TYPES, columns), {
        page: 1,
        perPage: 10,
        sortBy: {
          key: 'updated',
          direction: 'desc',
        },
      }),
    });
};
