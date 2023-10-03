import './RecommendationsPage.scss';

import React, { useEffect, useState } from 'react';
import { Bullseye, Pagination, Title, Toolbar, ToolbarContent, ToolbarItem } from '@patternfly/react-core';

import { getRecommendations, isError } from '../../api';
import { PERMISSIONS, SERVICES } from '../../Helpers/constants';
import Loading from '../Customs/Loading';
import WithPermission from '../Customs/WithPermisson';
import RecommendationsTable from './RecommendationsTable';
import { Recommendation } from './types';

export const RecommendationsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);
  const [recommendations, setRecommendations] = React.useState<Recommendation[]>([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [showSkeleton, setShowSkeleton] = useState(false);

  const fetchData = async (page: number, perPage: number) => {
    setShowSkeleton(true);
    const response = await getRecommendations(page, perPage);
    if (isError(response)) {
      return;
    }
    if (response.data?.length === 0) {
      setIsEmpty(true);
    } else {
      const recommendations = response.data?.map((rec) => ({
        id: rec.rule_id,
        description: rec.description,
        publish_date: rec.publish_date,
        systems: rec.impacted_systems_count,
        remediation: rec.playbook_count > 0 ? 'Playbook' : 'Manual',
      }));
      setRecommendations(recommendations);
      setTotal(response.meta?.count);
    }
    setShowSkeleton(false);
    return response.meta?.count;
  };

  const onSetPage = (_event: React.MouseEvent | React.KeyboardEvent | MouseEvent, newPage: number) => {
    setPage(newPage);
    fetchData(newPage, perPage);
  };

  const onPerPageSelect = (_event: React.MouseEvent | React.KeyboardEvent | MouseEvent, newPerPage: number, newPage: number) => {
    setPerPage(newPerPage);
    setPage(newPage);
    fetchData(newPage, newPerPage);
  };

  const buildPagination = () => {
    return <Pagination itemCount={total} perPage={perPage} page={page} onSetPage={onSetPage} onPerPageSelect={onPerPageSelect} />;
  };

  useEffect(() => {
    fetchData(page, perPage);
    setIsLoading(false);
  }, []);

  return (
    <Loading isLoading={isLoading}>
      <WithPermission serviceName={SERVICES.tasks} requiredPermissions={[PERMISSIONS.useTasks]}>
        <WithPermission serviceName={SERVICES.inventory} requiredPermissions={[PERMISSIONS.readHosts]}>
          {isEmpty ? (
            <Bullseye>
              <Title headingLevel="h1" size="lg">
                No recommendations found
              </Title>
            </Bullseye>
          ) : (
            <React.Fragment>
              <Toolbar>
                <ToolbarContent>
                  <ToolbarItem variant="pagination">{buildPagination()}</ToolbarItem>
                </ToolbarContent>
              </Toolbar>
              <RecommendationsTable recommendations={recommendations} perPage={perPage} showSkeleton={showSkeleton} />
              <Toolbar>
                <ToolbarContent>
                  <ToolbarItem variant="pagination">{buildPagination()}</ToolbarItem>
                </ToolbarContent>
              </Toolbar>
            </React.Fragment>
          )}
        </WithPermission>
      </WithPermission>
    </Loading>
  );
};

export default RecommendationsPage;
