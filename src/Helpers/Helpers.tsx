import React from 'react';
import { Text, TextContent } from '@patternfly/react-core';
import { Tbody, Td, Tr } from '@patternfly/react-table';
import { Skeleton } from '@redhat-cloud-services/frontend-components/Skeleton';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';

export const dispatchNotification = (store, notification) => {
  store.dispatch(addNotification(notification));
};

export const tasksExecuteSucessNotif = (store, title, ids, task_id) => {
  dispatchNotification(store, {
    variant: 'info',
    title: 'Task running',
    description: (
      <span>
        Your task &quot;{title}&quot; is running on {ids.length} system
        {ids.length > 1 ? 's' : ''}.
        <br />
        <br />
        <TextContent>
          <Text component="a" href={`/insights/tasks/executed/${task_id}`} rel="noreferrer" target="_blank">
            View progress
          </Text>
        </TextContent>
      </span>
    ),
    dismissable: true,
  });
};

export const remediationsCreatedNotif = (store, title, remediation_id) => {
  dispatchNotification(store, {
    variant: 'info',
    title: 'Remediation created',
    description: (
      <span>
        Your remediation playbook &quot;{title}&quot; has been created.
        <br />
        <br />
        <TextContent>
          <Text component="a" href={`/insights/remediations/${remediation_id}`} rel="noreferrer" target="_blank">
            View remediation
          </Text>
        </TextContent>
      </span>
    ),
    dismissable: true,
  });
};

export const displayErrorNotification = (store, message) => {
  dispatchNotification(store, {
    variant: 'danger',
    title: 'Error',
    description: message,
    dismissable: true,
    autoDismiss: false,
  });
};

export const loadingSkeletons = (perPage: number, columnsCount: number) =>
  [...Array(perPage)].map((_, index) => (
    <Tbody key={index}>
      <Tr key={index}>
        {[...Array(columnsCount)].map((_, index) => (
          <Td key={index}>
            <Skeleton />
          </Td>
        ))}
      </Tr>
    </Tbody>
  ));
