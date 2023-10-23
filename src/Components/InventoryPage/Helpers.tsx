import React from 'react';
import { Text, TextContent } from '@patternfly/react-core';
import ReducerRegistry from '@redhat-cloud-services/frontend-components-utilities/ReducerRegistry';

import { Reducer } from 'redux';

import { entitiesReducer } from '../../store/index';
import { SystemColumn, SystemFilters } from './types';

export const buildAditionalFields = (fields: string[]): string => {
  return fields.length ? `&fields[system_profile][]=${fields.join(',')}` : '';
};

export const buildSortString = (orderBy: string, orderDirection: string): string => {
  const order = orderBy ? `&order_by=${orderBy}` : '';
  const orderHow = orderBy && orderDirection ? `&order_how=${orderDirection}` : '';

  return `${order}${orderHow}`;
};

export const buildFilterString = (filters: SystemFilters): string => {
  const displayNameFilter = filters.hostnameOrId ? `&display_name=${filters.hostnameOrId}` : '';
  let osFilter = '';
  filters.osFilter?.forEach(({ value }) => {
    osFilter += `&filter[system_profile][operating_system][RHEL][version][eq][]=${value}`;
  });

  return `${displayNameFilter}${osFilter}`;
};

export const buildPerPagePageString = (perPage: number, page: number): string => {
  const limitOffsetString = `&per_page=${perPage}&page=${page}`;
  return limitOffsetString;
};

export const findCheckedValue = (items, selectedIds: string[]): boolean | null => {
  const selectedLength = selectedIds?.length;
  const allOnPageSelected = items.every((item) => selectedIds.includes(item.id));
  const anyOnPageSelected = items.some((item) => selectedIds.includes(item.id));
  if (allOnPageSelected && selectedLength) return true;
  else if (anyOnPageSelected && selectedLength) return null;
  else return false;
};

const createSystemLink = (id: string, name: string, keyData: string, isBetaEnv: boolean): JSX.Element => (
  <TextContent>
    <Text
      component="a"
      key={keyData}
      className="name-column"
      href={isBetaEnv ? `/preview/insights/inventory/${id}` : `/insights/inventory/${id}`}
      rel="noreferrer"
      target="_blank"
    >
      {name}
    </Text>
  </TextContent>
);

export const systemColumns = (isBeta: boolean): SystemColumn[] => [
  {
    key: 'display_name',
    sortKey: 'display_name',
    props: { width: 40 },
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
    key: 'system_profile',
    sortKey: 'operating_system',
    props: { width: 10 },
    title: 'OS',
    renderFunc: ({ operating_system }) => {
      const { name, major, minor } = operating_system || {};
      return name ? <p>{`${name} ${major}.${minor}`}</p> : <p>Not available</p>;
    },
  },
  {
    key: 'updated',
    title: 'updated',
  },
];

export const defaultOnLoad = (getRegistry: () => ReducerRegistry<Reducer>) => {
  return ({ mergeWithEntities }) =>
    getRegistry().register({
      ...mergeWithEntities(entitiesReducer(), {
        page: 1,
        perPage: 10,
        sortBy: {
          key: 'updated',
          direction: 'desc',
        },
      }),
    });
};
