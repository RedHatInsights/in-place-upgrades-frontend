import React, { useContext, useEffect, useState } from 'react';
import { Alert, Button, Flex, FlexItem, Grid, GridItem, Text, TextContent, TextVariants } from '@patternfly/react-core';
import ErrorState from '@redhat-cloud-services/frontend-components/ErrorState';

import { isError, tasksExecuteTask, tasksFetchTaskInfo } from '../../api';
import { PERMISSIONS, SERVICES } from '../../Helpers/constants';
import { INFO_ALERT_SYSTEMS, TASKS_API_ROOT, TASKS_AVAILABLE_ROOT } from '../../Helpers/constants';
import { displayErrorNotification, tasksExecuteSucessNotif } from '../../Helpers/Helpers';
import { RegistryContext } from '../../store';
import Card from '../Common/Card';
import Loading from '../Common/Loading';
import SystemPickerModal from '../Common/SystemPickerModal';
import WithPermission from '../Common/WithPermisson';
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
  const { getRegistry } = useContext(RegistryContext);

  useEffect(() => {
    tasksFetchTaskInfo(slug).then((fetchedTaskInfo) => {
      if (!isError(fetchedTaskInfo)) {
        setTaskInfo(fetchedTaskInfo);
        setTaskAvailable(true);
      }
      setIsLoading(false);
    });
  }, []);

  const onTaskSubmit = async (selectedSystems: string[]) => {
    const store = getRegistry().getStore();
    const result = await tasksExecuteTask({ task: slug, hosts: selectedSystems });
    if (isError(result)) {
      displayErrorNotification(store, result.message);
    } else {
      tasksExecuteSucessNotif(store, taskInfo.title, selectedSystems, result.data.id);
    }
  };

  return (
    <Loading isLoading={isLoading}>
      <WithPermission serviceName={SERVICES.tasks} requiredPermissions={PERMISSIONS.tasks}>
        <WithPermission serviceName={SERVICES.inventory} requiredPermissions={PERMISSIONS.inventoryHostsRead}>
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
                <SystemPickerModal
                  isOpen={modalIsOpen}
                  setIsOpen={setModalIsOpen}
                  title={taskInfo.title}
                  onSubmit={onTaskSubmit}
                  submitText={'Execute task'}
                  header={
                    <>
                      <Flex>
                        <FlexItem>
                          <b>Task description</b>
                        </FlexItem>
                      </Flex>
                      <Flex style={{ paddingBottom: '8px' }}>
                        <FlexItem style={{ width: '100%' }}>
                          <TextContent>
                            <Text component={TextVariants.p}>{taskInfo.description}</Text>
                          </TextContent>
                        </FlexItem>
                      </Flex>
                      <Flex>
                        <FlexItem>
                          <a href={`${TASKS_API_ROOT}${TASKS_AVAILABLE_ROOT}/${slug}/playbook`}>Download preview of playbook</a>
                        </FlexItem>
                      </Flex>
                      <br />
                      <TextContent style={{ paddingBottom: '8px' }}>
                        <Text component={TextVariants.p}>
                          <b>Systems to run task on</b>
                        </Text>
                      </TextContent>
                      <Alert variant="info" isInline title={INFO_ALERT_SYSTEMS} />
                    </>
                  }
                />
              )}
            </React.Fragment>
          )}
        </WithPermission>
      </WithPermission>
    </Loading>
  );
};

export default TasksPage;
