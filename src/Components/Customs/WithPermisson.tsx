import React from 'react';
import { useRbac } from '../../Helpers/hooks';
import NotAuthorized from '@redhat-cloud-services/frontend-components/NotAuthorized';
import { Bullseye, Spinner } from '@patternfly/react-core';

type WithPermissionProps = {
  children: JSX.Element;
  serviceName: string;
  requiredPermissions: string[];
};

const WithPermission = ({ children, serviceName, requiredPermissions }: WithPermissionProps): JSX.Element => {
  const [allPermissons, isLoading] = useRbac(requiredPermissions, serviceName);
  const hasAccess = allPermissons.every((perm) => perm);

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
