import React, { useState } from 'react';
import { Pagination, Toolbar, ToolbarContent, ToolbarItem } from '@patternfly/react-core';
import { Text } from '@patternfly/react-core';
import { Card, CardBody, CardTitle } from '@patternfly/react-core';

import { PERMISSIONS, SERVICES } from '../../Helpers/constants';
import WithPermission from '../Common/WithPermisson';
import RecommendationsTable from './RemediationsTable';

export const RemediationsPage = () => {
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

  const buildPagination = (variant) => {
    return (
      <Pagination
        itemCount={total}
        perPage={perPage}
        page={page}
        onSetPage={onSetPage}
        onPerPageSelect={onPerPageSelect}
        isCompact={variant === 'top'}
      />
    );
  };

  return (
    <WithPermission serviceName={SERVICES.advisor} requiredPermissions={PERMISSIONS.useRemediations}>
      <React.Fragment>
        <Card>
          <CardTitle>Remmediations</CardTitle>
          <CardBody>
            <Text>This page contains a list of remediations playbooks that can be applied to your systems to fix issues with upgrades.</Text>
          </CardBody>
        </Card>
        <Toolbar>
          <ToolbarContent>
            <ToolbarItem variant="pagination">{buildPagination('top')}</ToolbarItem>
          </ToolbarContent>
        </Toolbar>
        <RecommendationsTable page={page} perPage={perPage} setTotal={setTotal} />
        <Toolbar>
          <ToolbarContent>
            <ToolbarItem variant="pagination">{buildPagination('bottom')}</ToolbarItem>
          </ToolbarContent>
        </Toolbar>
      </React.Fragment>
    </WithPermission>
  );
};

export default RemediationsPage;
