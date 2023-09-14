import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import InventoryPage from '../InventoryPage';
import { useGetEntities } from '../hooks';
import { findCheckedValue } from '../Helpers';
import { useRbac } from '../../../Helpers/hooks';

const systemsMock = {
  total: 2,
  count: 2,
  page: 1,
  per_page: 10,
  results: [
    {
      display_name: 'rhiqe.8d8fe668-c2ee-4034-b174-2af31020402c.email-38.alvarez.com',
      id: '1d2a2d8b-8bb1-48f3-a367-c8ba2f4d8fc3',
      system_profile: {
        operating_system: {
          major: 8,
          minor: 6,
          name: 'RHEL',
        },
      },
      selected: true,
      updated: '2022-04-20T12:49:29.389485Z',
    },
    {
      display_name: 'rhiqe.laptop-44.sanchez-mann.biz',
      id: 'aa28f81c-e7f0-4ee4-af46-0352b0fb50f3',
      system_profile: {
        operating_system: {
          major: 8,
          minor: 8,
          name: 'RHEL',
        },
      },
      selected: false,
      updated: '2022-05-04T07:08:37.176240Z',
    },
  ],
};

const systemTags = {
  total: 2,
  count: 2,
  page: 1,
  per_page: 10,
  results: {
    '1d2a2d8b-8bb1-48f3-a367-c8ba2f4d8fc3': [
      {
        namespace: 'insights-client',
        key: 'application',
        value: 'TEST',
      },
      {
        namespace: 'insights-client',
        key: 'cloud',
        value: 'POG',
      },
    ],
  },
};

jest.mock('../../../api', () => {
  return {
    inventoryFetchSystems: jest.fn(() => Promise.resolve(systemsMock)),
    inventoryFetchSystemsTags: jest.fn(() => Promise.resolve(systemTags)),
  };
});

jest.mock('../../../Helpers/hooks');

describe('InventoryTable', () => {
  let mockStore = configureStore();
  let props;
  const setSelectedIds = jest.fn();

  beforeEach(() => {
    useRbac.mockImplementation(() => [[true], false]);
  });

  it('should render correctly', () => {
    const store = mockStore(props);
    const { asFragment } = render(
      <Provider store={store}>
        <Router>
          <InventoryPage selectedIds={[]} setSelectedIds={setSelectedIds} />
        </Router>
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render correctly without permissions', () => {
    useRbac.mockImplementation(() => [[false], false]);
    const store = mockStore(props);
    const { asFragment } = render(
      <Provider store={store}>
        <Router>
          <InventoryPage selectedIds={[]} setSelectedIds={setSelectedIds} />
        </Router>
      </Provider>
    );
    expect(asFragment().textContent).toMatch(/You do not have access to Upgrades/);
  });

  it('useGetEntities hook should work', async () => {
    const onComplete = jest.fn();
    const getEntities = useGetEntities(onComplete, { selectedIds: ['1d2a2d8b-8bb1-48f3-a367-c8ba2f4d8fc3'] });
    const _items = jest.fn();
    const config = {
      page: 1,
      per_page: 10,
      orderBy: 'updated',
      orderDirection: 'DESC',
      filters: {
        staleFilter: undefined,
        lastSeenFilter: undefined,
        registeredWithFilter: undefined,
        osFilter: ['8.0', '8.6'],
        hostGroupFilter: undefined,
        hostnameOrId: 'blob',
      },
    };
    const entities = await getEntities(_items, config);
    const resultSystems = systemsMock.results.map((system) => {
      return {
        ...system,
        tags: systemTags.results[system.id] || [],
      };
    });

    expect(entities.results).toEqual(resultSystems);
    expect(onComplete).toHaveBeenCalled();

    // check get entities without selectedIds
    const getEntitiesWithoutSelectedIds = useGetEntities(onComplete, {});
    const entitiesWithoutSelectedIds = await getEntitiesWithoutSelectedIds(_items, config);
    const systemsMockWithoutSelected = systemsMock.results.map((system) => {
      return {
        ...system,
        selected: false,
        tags: systemTags.results[system.id] || [],
      };
    });
    expect(entitiesWithoutSelectedIds.results).toEqual(systemsMockWithoutSelected);
    expect(onComplete).toHaveBeenCalled();
  });

  it('findCheckedValue helper should work', () => {
    const checkedValue = findCheckedValue(systemsMock.results, []);
    expect(checkedValue).toEqual(false);

    const checkedValue2 = findCheckedValue(systemsMock.results, ['1d2a2d8b-8bb1-48f3-a367-c8ba2f4d8fc3']);
    expect(checkedValue2).toEqual(null);

    const checkedValue3 = findCheckedValue(systemsMock.results, ['1d2a2d8b-8bb1-48f3-a367-c8ba2f4d8fc3', 'aa28f81c-e7f0-4ee4-af46-0352b0fb50f3']);
    expect(checkedValue3).toEqual(true);
  });
});
