import React, { useContext, useEffect, useState } from 'react';
import { Bullseye, Button } from '@patternfly/react-core';
import { Icon } from '@patternfly/react-core';
import {
  EmptyState,
  EmptyStateHeader,
  EmptyStateIcon,
  EmptyStateVariant,
  Flex,
  FlexItem,
  Text,
  TextContent,
  TextVariants,
} from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import { PlayIcon, WrenchIcon } from '@patternfly/react-icons';
import { Table, Tbody, Td, Th, Thead, ThProps, Tr } from '@patternfly/react-table';
import { DateFormat } from '@redhat-cloud-services/frontend-components/DateFormat';

import { getRecommendations, isError, remedationsCreate, remediationsResolutions } from '../../api';
import { RECOMMENDATIONS_DETAIL_ROOT } from '../../Helpers/constants';
import { loadingSkeletons, remediationsCreatedNotif } from '../../Helpers/Helpers';
import { displayErrorNotification } from '../../Helpers/Helpers';
import { RegistryContext } from '../../store';
import SystemPickerModal from '../Common/SystemPickerModal';
import { Recommendation, Resolution } from './types';

const RecommendationsTable = ({ page, perPage, setTotal }) => {
  const columnNames = {
    description: 'Name',
    publish_date: 'Modified',
    systems: 'Systems',
    remediation: 'Remediation',
    run: 'Run',
  };

  const [showSkeleton, setShowSkeleton] = useState(false);
  const [activeSortIndex, setActiveSortIndex] = React.useState<number | null>(null);
  const [activeSortDirection, setActiveSortDirection] = React.useState<'asc' | 'desc' | null>(null);
  const [recommendations, setRecommendations] = React.useState<Recommendation[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [currentRule, setCurrentRule] = useState<Recommendation | null>(null);
  const [currentResolutions, setCurrentResolutions] = useState<Resolution | null>(null);

  const ruleName = currentRule?.id.replace('leapp_report|', '') || '';

  const { getRegistry } = useContext(RegistryContext);

  const getResolutionsInfo = async (rule: Recommendation) => {
    setCurrentResolutions(null);
    const response = await remediationsResolutions(rule.id);
    if (isError(response)) {
      const store = getRegistry().getStore();
      displayErrorNotification(store, response.message);
      return;
    }
    setCurrentResolutions(response[`advisor:${rule.id}`]?.resolutions[0]);
  };

  const createRemediation = async (selectedSystems) => {
    if (!currentRule) return;
    const response = await remedationsCreate(ruleName, currentRule.id, selectedSystems, currentResolutions?.needs_reboot);
    if (isError(response)) {
      const store = getRegistry().getStore();
      displayErrorNotification(store, response.message);
    } else {
      console.log('responsse: ', response);
      remediationsCreatedNotif(getRegistry().getStore(), ruleName, response.data.id);
    }
  };

  const buildSort = (direction, index): string => {
    if (direction === null || index === null) {
      return 'description';
    }
    const sortMap = {
      0: 'description',
      1: 'publish_date',
      2: 'impacted_count',
      3: 'playbook_count',
    };
    const sign = direction === 'asc' ? '' : '-';
    const sort = sign + sortMap[index];
    return sort;
  };

  const fetchData = async (page: number, perPage: number, sort) => {
    setShowSkeleton(true);

    const response = await getRecommendations(page, perPage, sort);
    if (isError(response)) {
      const store = getRegistry().getStore();
      displayErrorNotification(store, response.message);
      return;
    }

    let recommendations = response.data?.data;
    recommendations = recommendations?.map((rec) => ({
      id: rec.rule_id,
      description: rec.description,
      publish_date: rec.publish_date,
      systems: rec.impacted_systems_count,
      remediation: rec.playbook_count > 0 ? 'Playbook' : 'Manual',
    }));
    setRecommendations(recommendations);

    const count = response.data?.meta?.count;
    setTotal(count);

    setShowSkeleton(false);
    return count;
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
            <Th sort={getSortParams(1)}>{columnNames.publish_date}</Th>
            <Th sort={getSortParams(2)}>{columnNames.systems}</Th>
            <Th sort={getSortParams(3)}>{columnNames.remediation}</Th>
          </Tr>
        </Thead>
        {showSkeleton ? (
          loadingSkeletons(perPage, Object.keys(columnNames).length)
        ) : (
          <Tbody>
            {recommendations.length === 0 ? (
              <Tr>
                <Td colSpan={Object.keys(columnNames).length}>
                  <Bullseye>
                    <EmptyState variant={EmptyStateVariant.sm}>
                      <EmptyStateHeader icon={<EmptyStateIcon icon={SearchIcon} />} titleText="No recommendations found" headingLevel="h2" />
                    </EmptyState>
                  </Bullseye>
                </Td>
              </Tr>
            ) : (
              recommendations.map((rec, rowIndex) => (
                <Tr key={rowIndex}>
                  <Td dataLabel={columnNames.description} width={60}>
                    <a key={rec.id} href={`${RECOMMENDATIONS_DETAIL_ROOT}/${rec.id}`} target="_blank" rel="noreferrer">
                      {rec.description}{' '}
                      <Icon size="sm">
                        <ExternalLinkAltIcon />
                      </Icon>
                    </a>
                  </Td>
                  <Td dataLabel={columnNames.publish_date}>
                    <DateFormat key={rec.id} date={rec.publish_date} />
                  </Td>
                  <Td dataLabel={columnNames.systems}>{rec.systems}</Td>
                  <Td dataLabel={columnNames.remediation}>
                    {rec.remediation === 'Playbook' ? <PlayIcon /> : <WrenchIcon />} {rec.remediation}
                  </Td>
                  <Td dataLabel={columnNames.run} modifier="fitContent">
                    {rec.remediation === 'Playbook' && (
                      <Button
                        variant="primary"
                        onClick={() => {
                          setCurrentRule(rec);
                          getResolutionsInfo(rec);
                          setModalIsOpen(true);
                        }}
                      >
                        {columnNames.run}
                      </Button>
                    )}
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        )}
      </Table>

      {modalIsOpen && (
        <SystemPickerModal
          isOpen={modalIsOpen}
          setIsOpen={setModalIsOpen}
          title={`Create remediation playbook for ${ruleName}`}
          onSubmit={createRemediation}
          submitText={'Create remediation playbook'}
          header={
            <>
              <Flex style={{ paddingBottom: '8px' }}>
                <FlexItem style={{ width: '100%' }}>
                  <TextContent>
                    <Text component={TextVariants.p}>{currentRule?.description}</Text>
                  </TextContent>
                  <br />
                  <TextContent>
                    <Text component={TextVariants.p}>
                      The playbook <b>{ruleName}</b> does <span style={{ color: 'red' }}>{currentResolutions?.needs_reboot ? '' : 'not'}</span> auto
                      reboot systems.
                    </Text>
                  </TextContent>
                </FlexItem>
              </Flex>
            </>
          }
        />
      )}
    </React.Fragment>
  );
};

export default RecommendationsTable;
