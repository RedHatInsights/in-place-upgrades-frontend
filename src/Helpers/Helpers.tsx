import React from 'react';
import { Text, TextContent } from '@patternfly/react-core';
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

export const tasksExecuteErrorNotif = (store, message) => {
  dispatchNotification(store, {
    variant: 'danger',
    title: 'Error',
    description: message,
    dismissable: true,
    autoDismiss: false,
  });
};
