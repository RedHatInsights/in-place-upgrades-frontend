import React, { useContext, useEffect, useRef, useState } from 'react';
import propTypes from 'prop-types';
import { Bullseye, Spinner } from '@patternfly/react-core';
import { useGetEntities } from './hooks';
import { defaultOnLoad, findCheckedValue, systemColumns } from './helpers';
import { RegistryContext } from '../../store';
import { InventoryTable } from '@redhat-cloud-services/frontend-components/Inventory';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import { SystemColumn } from './types';
import { useDispatch } from 'react-redux';
import { useRbac } from '../../Helpers/Hooks';
import { PERMISSIONS } from '../../Helpers/constants';
import { NotAuthorized } from '@redhat-cloud-services/frontend-components/NotAuthorized';
import { fetchSystems } from '../../api';

import './InventoryPage.scss';

export const InventoryPage = ({ selectedIds, setSelectedIds }) => {
  const chrome = useChrome();
  const dispatch = useDispatch();
  const inventory = useRef(null);
  const { getRegistry } = useContext(RegistryContext);

  const [activeFiltersString, setActiveFiltersString] = useState('');
  const [isBulkLoading, setBulkLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0 as number);
  const [[canReadHostsInventory], isLoadingInventory] = useRbac([PERMISSIONS.readHosts], 'inventory');

  useEffect(() => {
    dispatch({ type: 'INVENTORY_INIT' });
    dispatch({ type: 'RESET_PAGE' });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    inventory?.current?.onRefreshData();
  }, [dispatch]);

  useEffect(() => {
    dispatch({
      type: 'SELECT_ENTITIES',
      payload: {
        selected: selectedIds,
      },
    });
  }, [selectedIds]);

  const onComplete = (result, filtersString: string) => {
    setTotal(result.total);
    setItems(result.results);
    setActiveFiltersString(filtersString);
  };

  const getEntities = useGetEntities(onComplete, {
    selectedIds,
  });

  const mergedColumns = (defaultColumns) =>
    systemColumns(chrome?.isBeta?.()).map((column: SystemColumn) => {
      const defaultColumn = defaultColumns.find((defaultCol) => defaultCol.key === column.key);
      return {
        ...defaultColumn,
        ...column,
        props: {
          ...defaultColumn?.props,
          ...column?.props,
        },
      };
    });

  const selectIds = (_event, _isSelected, _index, entity) => {
    const newSelectedIds: string[] = [...selectedIds];

    !newSelectedIds.includes(entity.id) ? newSelectedIds.push(entity.id) : newSelectedIds.splice(newSelectedIds.indexOf(entity.id), 1);

    setSelectedIds(newSelectedIds);
  };

  const bulkSelectIds = async (type: string, options?) => {
    const newSelectedIds = [...selectedIds];

    setBulkLoading(true);
    switch (type) {
      case 'none': {
        setSelectedIds([]);
        break;
      }

      case 'page': {
        options.items.forEach((item) => {
          if (!newSelectedIds.includes(item.id)) {
            newSelectedIds.push(item.id);
          }
        });

        setSelectedIds(newSelectedIds);
        break;
      }

      case 'page-none': {
        options.items.forEach((item) => {
          if (newSelectedIds.includes(item.id)) {
            newSelectedIds.splice(newSelectedIds.indexOf(item.id), 1);
          }
        });

        setSelectedIds(newSelectedIds);
        break;
      }

      case 'all': {
        const ids = [] as string[];
        const perPage = 100;
        const totalPages = Math.ceil(total / perPage);
        for (let page = 1; page <= totalPages; page++) {
          const { results: pageResults } = await fetchSystems(`?per_page=100&page=${page}${activeFiltersString}`);
          ids.push(...pageResults.map(({ id }) => id));
        }
        setSelectedIds(ids);
        break;
      }
    }
    setBulkLoading(false);
  };

  return isLoadingInventory ? (
    <Bullseye>
      <Spinner />
    </Bullseye>
  ) : canReadHostsInventory ? (
    <InventoryTable
      isFullView
      autoRefresh
      showTags
      hideFilters={{
        all: true,
        name: false,
        operatingSystem: false,
      }}
      columns={mergedColumns}
      ref={inventory}
      fallback={
        <Bullseye>
          <Spinner />
        </Bullseye>
      }
      onLoad={defaultOnLoad(getRegistry)}
      getEntities={getEntities}
      tableProps={{
        isStickyHeader: true,
        isStriped: true,
        canSelectAll: false,
        onSelect: items.length ? selectIds : null,
      }}
      bulkSelect={{
        id: 'systems-bulk-select',
        isDisabled: !total,
        items: [
          {
            title: `Select none (0)`,
            onClick: () => {
              bulkSelectIds('none');
            },
          },
          {
            title: `Select page (${items?.length || 0})`,
            onClick: () => {
              bulkSelectIds('page', { items: items });
            },
          },
          {
            title: `Select all (${total || 0})`,
            onClick: () => {
              bulkSelectIds('all', { total: total });
            },
          },
        ],
        onSelect: () => {
          const allOnPageSelected = findCheckedValue(items, selectedIds);
          if (allOnPageSelected) {
            bulkSelectIds('page-none', { items: items });
          } else {
            bulkSelectIds('page', { items: items });
          }
        },
        checked: items && selectedIds ? findCheckedValue(items, selectedIds) : null,
        toggleProps: {
          'data-ouia-component-type': 'bulk-select-toggle-button',
          children: isBulkLoading
            ? [
                <React.Fragment key="sd">
                  <Spinner size="sm" />
                  {` ${selectedIds.length} selected `}
                </React.Fragment>,
              ]
            : `${selectedIds.length} selected `,
        },
      }}
    />
  ) : (
    <NotAuthorized serviceName="Upgrades" />
  );
};

InventoryPage.propTypes = {
  selectedIds: propTypes.arrayOf(propTypes.string),
  setSelectedIds: propTypes.func,
};

export default InventoryPage;
