import React, { useState } from 'react';
import { Pagination, Toolbar, ToolbarContent, ToolbarItem } from '@patternfly/react-core';
import { Text } from '@patternfly/react-core';
import { Card, CardBody, CardTitle } from '@patternfly/react-core';

import { PERMISSIONS, SERVICES } from '../../Helpers/constants';
import WithPermission from '../Customs/WithPermisson';
import RecommendationsTable from './RecommendationsTable';

export const RecommendationsPage = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);

  const onSetPage = (_event: React.MouseEvent | React.KeyboardEvent | MouseEvent, newPage: number) => {
    setPage(newPage);
  };

  const onPerPageSelect = (_event: React.MouseEvent | React.KeyboardEvent | MouseEvent, newPerPage: number, newPage: number) => {
    setPerPage(newPerPage);
    setPage(newPage);
  };

  const buildPagination = () => {
    return <Pagination itemCount={total} perPage={perPage} page={page} onSetPage={onSetPage} onPerPageSelect={onPerPageSelect} />;
  };

  return (
    <WithPermission serviceName={SERVICES.advisor} requiredPermissions={PERMISSIONS.useRecommendations}>
      <React.Fragment>
        <Card>
          <CardTitle>Recommendations</CardTitle>
          <CardBody>
            <Text>
              This page contains a list of recommendations that can be applied to your systems to fix issues with upgrades. You can apply them
              manually or run a playbook to automate the process. The recommendations are taken from the In-place upgrade topic in Advisor.
            </Text>
          </CardBody>
        </Card>
        <Toolbar>
          <ToolbarContent>
            <ToolbarItem variant="pagination">{buildPagination()}</ToolbarItem>
          </ToolbarContent>
        </Toolbar>
        <RecommendationsTable page={page} perPage={perPage} setTotal={setTotal} />
        <Toolbar>
          <ToolbarContent>
            <ToolbarItem variant="pagination">{buildPagination()}</ToolbarItem>
          </ToolbarContent>
        </Toolbar>
      </React.Fragment>
    </WithPermission>
  );
};

export default RecommendationsPage;
