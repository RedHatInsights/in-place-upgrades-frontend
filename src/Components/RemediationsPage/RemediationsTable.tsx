import React, { useContext, useEffect, useState } from 'react';
import { Bullseye } from '@patternfly/react-core';
import { Icon } from '@patternfly/react-core';
import { EmptyState, EmptyStateBody, EmptyStateHeader, EmptyStateIcon, EmptyStateVariant } from '@patternfly/react-core';
import { WrenchIcon } from '@patternfly/react-icons';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import { Table, Tbody, Td, Th, Thead, ThProps, Tr } from '@patternfly/react-table';
import { DateFormat } from '@redhat-cloud-services/frontend-components/DateFormat';

import { isError, remediationsFetch } from '../../api';
import { REMEDIATIONS_DETAIL_ROOT } from '../../Helpers/constants';
import { loadingSkeletons } from '../../Helpers/Helpers';
import { displayErrorNotification } from '../../Helpers/Helpers';
import { RegistryContext } from '../../store';
import { Remediation } from './types';

const RemediationsTable = ({ page, perPage, setTotal }) => {
  const columnNames = {
    description: 'Name',
    updated_at: 'Last modified',
    status: 'Issues resolved',
    system_count: 'Total systems',
  };

  const [showSkeleton, setShowSkeleton] = useState(false);
  const [activeSortIndex, setActiveSortIndex] = React.useState<number | null>(null);
  const [activeSortDirection, setActiveSortDirection] = React.useState<'asc' | 'desc' | null>(null);
  const [remediations, setRemediations] = React.useState<Remediation[]>([]);

  const { getRegistry } = useContext(RegistryContext);

  const buildSort = (direction, index): string => {
    if (direction === null || index === null) {
      return 'updated_at';
    }
    const sortMap = {
      0: 'name',
      1: 'updated_at',
      2: 'system_count',
    };
    const sign = direction === 'asc' ? '' : '-';
    const sort = sign + sortMap[index];
    return sort;
  };

  const fetchData = async (page: number, perPage: number, sort) => {
    setShowSkeleton(true);

    const response = await remediationsFetch(page, perPage, sort);
    if (isError(response)) {
      const store = getRegistry().getStore();
      displayErrorNotification(store, response.message);
      return;
    }

    const remediations = response.data.map((rem) => ({
      id: rem.id,
      name: rem.name,
      updated_at: rem.updated_at,
      system_count: rem.system_count,
      resolved_count: rem.resolved_count,
    }));

    setRemediations(remediations);
    const count = response.meta.count;
    setTotal(count);

    setShowSkeleton(false);
  };

  const getSortParams = (columnIndex: number): ThProps['sort'] => {
    return {
      sortBy: {
        index: activeSortIndex as number,
        direction: activeSortDirection as 'asc' | 'desc',
        defaultDirection: 'asc',
      },
      onSort: (_event, index, direction) => {
        setActiveSortIndex(index);
        setActiveSortDirection(direction);
      },
      columnIndex,
    };
  };

  useEffect(() => {
    fetchData(page, perPage, buildSort(activeSortDirection, activeSortIndex));
  }, [activeSortDirection, activeSortIndex, page, perPage]);

  return (
    <React.Fragment>
      <Table aria-label="Recommendations" ouiaId="RecommendationsTable">
        <Thead>
          <Tr>
            <Th sort={getSortParams(0)}>{columnNames.description}</Th>
            <Th sort={getSortParams(1)}>{columnNames.updated_at}</Th>
            <Th>{columnNames.status}</Th>
            <Th sort={getSortParams(2)}>{columnNames.system_count}</Th>
          </Tr>
        </Thead>
        {showSkeleton ? (
          loadingSkeletons(perPage, Object.keys(columnNames).length)
        ) : (
          <Tbody>
            {remediations.length === 0 ? (
              <Tr>
                <Td colSpan={Object.keys(columnNames).length}>
                  <Bullseye>
                    <EmptyState variant={EmptyStateVariant.full}>
                      <EmptyStateHeader icon={<EmptyStateIcon icon={WrenchIcon} />} titleText="No remediations playbooks yet" headingLevel="h2" />
                      <EmptyStateBody>
                        Insights uses Ansible Playbooks to remediate or mitigate configuration problems on your systems, and apply patches.
                        <br />
                        <br /> To create a remediation playbook, select <a href="/insights/upgrades/recommendations">Recommendations</a> tab.
                      </EmptyStateBody>
                    </EmptyState>
                  </Bullseye>
                </Td>
              </Tr>
            ) : (
              remediations.map((rec, rowIndex) => (
                <Tr key={rowIndex}>
                  <Td dataLabel={columnNames.description} width={60}>
                    <a key={rec.id} href={`${REMEDIATIONS_DETAIL_ROOT}/${rec.id}`} target="_blank" rel="noreferrer">
                      {rec.name}{' '}
                      <Icon size="sm">
                        <ExternalLinkAltIcon />
                      </Icon>
                    </a>
                  </Td>
                  <Td dataLabel={columnNames.updated_at}>
                    <DateFormat key={rec.id} date={rec.updated_at} />
                  </Td>
                  <Td dataLabel={columnNames.status}>{rec.resolved_count}</Td>
                  <Td dataLabel={columnNames.system_count}>{rec.system_count}</Td>
                </Tr>
              ))
            )}
          </Tbody>
        )}
      </Table>
    </React.Fragment>
  );
};

export default RemediationsTable;
