import React, { useContext, useRef } from 'react';
import { Bullseye, Spinner } from '@patternfly/react-core';
import { useGetEntities } from './hooks';
import { defaultOnLoad, systemColumns } from './helpers';
import { RegistryContext } from '../../store';
import { InventoryTable } from '@redhat-cloud-services/frontend-components/Inventory';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import { SystemColumn } from './types';

export const InventoryPage = () => {
  const chrome = useChrome();
  const inventory = useRef(null);
  const { getRegistry } = useContext(RegistryContext);

  const getEntities = useGetEntities(() => {}, {
    selectedIds: [],
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

  return (
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
      onLoad={defaultOnLoad(systemColumns(chrome?.isBeta?.()), getRegistry)}
      getEntities={getEntities}
      tableProps={{
        isStickyHeader: true,
        isStriped: true,
      }}
    />
  );
};

export default InventoryPage;
