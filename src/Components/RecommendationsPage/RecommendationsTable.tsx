import React from 'react';
import { Button, Skeleton } from '@patternfly/react-core';
import { Table, Tbody, Td, Th, Thead, ThProps, Tr } from '@patternfly/react-table';
import { DateFormat } from '@redhat-cloud-services/frontend-components/DateFormat';

import { RECOMMENDATIONS_DETAIL_ROOT } from '../../Helpers/constants';
import { Recommendation } from './types';

const RecommendationsTable = ({ recommendations, perPage, showSkeleton }) => {
  const columnNames = {
    description: 'Name',
    publish_date: 'Modified',
    systems: 'Systems',
    remediation: 'Remediation',
    run: 'Run',
  };

  const [activeSortIndex, setActiveSortIndex] = React.useState<number | null>(null);
  const [activeSortDirection, setActiveSortDirection] = React.useState<'asc' | 'desc' | null>(null);

  const getSortableRowValues = (rec: Recommendation): (string | number | Date)[] => {
    const { description, publish_date, systems, remediation } = rec;
    return [description, publish_date, systems, remediation];
  };

  if (activeSortIndex !== null) {
    recommendations.sort((a, b) => {
      const aValue = getSortableRowValues(a)[activeSortIndex];
      const bValue = getSortableRowValues(b)[activeSortIndex];
      if (typeof aValue === 'number') {
        // Numeric sort
        if (activeSortDirection === 'asc') {
          return (aValue as number) - (bValue as number);
        }
        return (bValue as number) - (aValue as number);
      } else {
        // String sort
        if (activeSortDirection === 'asc') {
          return (aValue as string).localeCompare(bValue as string);
        }
        return (bValue as string).localeCompare(aValue as string);
      }
    });
  }
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

  const loadinSkeletons = [...Array(perPage)].map((_, index) => (
    <Tbody key={index}>
      <Tr key={index}>
        {[...Array(Object.keys(columnNames).length + 1)].map((_, index) => (
          <Td key={index}>
            <Skeleton />
          </Td>
        ))}
      </Tr>
    </Tbody>
  ));

  return (
    <React.Fragment>
      <Table aria-label="Sortable table" ouiaId="SortableTable" data-testid="recommendations-table">
        <Thead>
          <Tr>
            <Th sort={getSortParams(0)}>{columnNames.description}</Th>
            <Th sort={getSortParams(1)}>{columnNames.publish_date}</Th>
            <Th sort={getSortParams(2)}>{columnNames.systems}</Th>
            <Th sort={getSortParams(3)}>{columnNames.remediation}</Th>
          </Tr>
        </Thead>
        {showSkeleton ? (
          loadinSkeletons
        ) : (
          <Tbody>
            {recommendations.map((rec, rowIndex) => (
              <Tr key={rowIndex}>
                <Td dataLabel={columnNames.description} width={60}>
                  <a key={rec.id} href={`${RECOMMENDATIONS_DETAIL_ROOT}/${rec.id}`}>
                    {rec.description}
                  </a>
                </Td>
                <Td dataLabel={columnNames.publish_date}>
                  <DateFormat key={rec.id} date={rec.publish_date} />
                </Td>
                <Td dataLabel={columnNames.systems}>{rec.systems}</Td>
                <Td dataLabel={columnNames.remediation}>{rec.remediation}</Td>
                <Td dataLabel={columnNames.run} modifier="fitContent">
                  <Button variant="primary">{columnNames.run}</Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        )}
      </Table>
    </React.Fragment>
  );
};

export default RecommendationsTable;
