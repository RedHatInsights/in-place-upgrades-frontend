import { useEffect, useState } from 'react';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';

const matchPermissions = (permissionA, permissionB) => {
  const segmentsA = permissionA.split(':');
  const segmentsB = permissionB.split(':');

  if (segmentsA.length !== segmentsB.length) {
    return false;
  }

  return segmentsA.every((segmentA, index) => segmentA === segmentsB[index] || segmentA === '*' || segmentsB[index] === '*');
};

export const useRbac = (requestedPermissions, app = 'upgrades') => {
  const [allPermissions, setAllPermissions] = useState([] as { permission: string }[]);
  const [loading, setLoading] = useState(true);
  const chrome = useChrome();

  useEffect(() => {
    chrome?.getUserPermissions?.(app, true).then((permissions) => {
      setAllPermissions(permissions);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return [requestedPermissions.map(() => []), true];
  }

  return [
    requestedPermissions.map((requestedPermission) => allPermissions?.some((item) => matchPermissions(item.permission, requestedPermission))),
    false,
  ];
};
