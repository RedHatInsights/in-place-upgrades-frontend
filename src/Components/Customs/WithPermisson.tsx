import React from 'react';
import { Bullseye, Spinner } from '@patternfly/react-core';
import NotAuthorized from '@redhat-cloud-services/frontend-components/NotAuthorized';
import { usePermissions } from '@redhat-cloud-services/frontend-components-utilities/RBACHook';

type WithPermissionProps = {
  children: JSX.Element;
  serviceName: string;
  requiredPermissions: string[];
};

const WithPermission = ({ children, serviceName, requiredPermissions }: WithPermissionProps): JSX.Element => {
  const { hasAccess, isLoading } = usePermissions(serviceName, requiredPermissions);

  if (!isLoading) {
    return hasAccess ? children : <NotAuthorized serviceName="Upgrades" />;
  } else {
    return (
      <Bullseye>
        <Spinner />
      </Bullseye>
    );
  }
};

export default WithPermission;
