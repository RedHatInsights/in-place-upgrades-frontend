import { createContext } from 'react';
import notificationsMiddleware from '@redhat-cloud-services/frontend-components-notifications/notificationsMiddleware';
import ReducerRegistry, { applyReducerHash } from '@redhat-cloud-services/frontend-components-utilities/ReducerRegistry';
import { getRegistry } from '@redhat-cloud-services/frontend-components-utilities/Registry';

import { Middleware, Reducer } from 'redux';
import promiseMiddleware from 'redux-promise-middleware';

export let registry: ReducerRegistry<Reducer>;

export const RegistryContext = createContext({
  getRegistry: (): ReducerRegistry<Reducer> => {
    return {} as ReducerRegistry<Reducer>;
  },
});

export function init(...middleware: Middleware[]) {
  registry = getRegistry({}, [promiseMiddleware, notificationsMiddleware({ errorDescriptionKey: ['detail', 'stack'] }), ...middleware]);
  return registry;
}

const selectRows = (rows, selected: string[]) =>
  rows.map((row) => ({
    ...row,
    selected: selected.includes(row.id),
  }));

export const entitiesReducer = () =>
  applyReducerHash({
    ['INVENTORY_INIT']: () => ({
      rows: [],
      total: 0,
    }),
    ['RESET_PAGE']: (state) => ({
      ...state,
      page: 1,
      perPage: 10,
    }),
    ['SELECT_ENTITIES']: (state, { payload: { selected } }) => {
      return {
        ...state,
        rows: selectRows(state.rows || [], selected),
      };
    },
  });
