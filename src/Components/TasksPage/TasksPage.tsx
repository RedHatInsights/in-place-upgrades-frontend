import React, { useEffect, useState } from 'react';
import { Button, Grid, GridItem } from '@patternfly/react-core';
import ErrorState from '@redhat-cloud-services/frontend-components/ErrorState';

import { isError, tasksFetchTaskInfo } from '../../api';
import { PERMISSIONS, SERVICES } from '../../Helpers/constants';
import Card from '../Customs/Card';
import Loading from '../Customs/Loading';
import WithPermission from '../Customs/WithPermisson';
import RunTaskModal from './RunTaskModal';
import TasksTable from './TasksTable';
import { TaskInfo } from './types';

type TasksPageProps = {
  slug: string;
};

export const TasksPage = ({ slug }: TasksPageProps) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [taskInfo, setTaskInfo] = useState({} as TaskInfo);
  const [isTaskAvailable, setTaskAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    tasksFetchTaskInfo(slug).then((fetchedTaskInfo) => {
      if (!isError(fetchedTaskInfo)) {
        setTaskInfo(fetchedTaskInfo);
        setTaskAvailable(true);
      }
      setIsLoading(false);
    });
  }, []);

  return (
    <Loading isLoading={isLoading}>
      <WithPermission serviceName={SERVICES.tasks} requiredPermissions={[PERMISSIONS.useTasks]}>
        <WithPermission serviceName={SERVICES.inventory} requiredPermissions={[PERMISSIONS.readHosts]}>
          {!isTaskAvailable ? (
            <ErrorState />
          ) : (
            <React.Fragment>
              <Grid>
                <GridItem span={12}>
                  <Card
                    title={taskInfo.title}
                    body={taskInfo.description}
                    footer={
                      <Button variant="primary" onClick={() => setModalIsOpen(true)}>
                        Run {slug === 'leapp-preupgrade' ? 'pre-upgrade' : 'in-place upgrade'} task
                      </Button>
                    }
                  />
                </GridItem>
                <GridItem span={12}>
                  <TasksTable slug={slug} />
                </GridItem>
              </Grid>
              {modalIsOpen && (
                <RunTaskModal isOpen={modalIsOpen} setIsOpen={setModalIsOpen} title={taskInfo.title} description={taskInfo.description} slug={slug} />
              )}
            </React.Fragment>
          )}
        </WithPermission>
      </WithPermission>
    </Loading>
  );
};

export default TasksPage;
