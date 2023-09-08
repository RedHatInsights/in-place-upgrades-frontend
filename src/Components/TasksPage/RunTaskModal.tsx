import React, { useContext, useState } from 'react';
import { RegistryContext } from '../../store';
import { Alert, Button, Flex, FlexItem, Modal, Text, TextContent, TextVariants } from '@patternfly/react-core';
import { INFO_ALERT_SYSTEMS, TASKS_API_ROOT, TASKS_AVAILABLE_ROOT } from '../../Helpers/constants';
import { tasksExecuteErrorNotif, tasksExecuteSucessNotif } from '../../Helpers/Helpers';
import { isError, tasksExecuteTask } from '../../api';
import InventoryPage from '../InventoryPage/InventoryPage';

export const RunTaskModal = ({ isOpen, setIsOpen, title, description, slug }) => {
  const [selectedSystems, setSelectedSystems] = useState([] as string[]);
  const [isExecuting, setIsExecuting] = useState(false);
  const { getRegistry } = useContext(RegistryContext);

  const submitTask = async (selectedSystems) => {
    setIsExecuting(true);

    const store = getRegistry().getStore();
    const result = await tasksExecuteTask({ task: slug, hosts: selectedSystems });
    if (isError(result)) {
      tasksExecuteErrorNotif(store, result.message);
    } else {
      tasksExecuteSucessNotif(store, title, selectedSystems, result.data.id);
    }

    setIsExecuting(false);
    setIsOpen(false);
  };

  return (
    <Modal
      title={title}
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      width={'70%'}
      actions={[
        <Button
          key="execute-task-button"
          variant="primary"
          onClick={() => submitTask(selectedSystems)}
          isDisabled={selectedSystems.length === 0 || isExecuting}
          isLoading={isExecuting}
        >
          Execute task
        </Button>,
        <Button key="cancel-execute-task-button" variant="link" onClick={() => setIsOpen(false)} isDisabled={isExecuting}>
          Cancel
        </Button>,
      ]}
    >
      <React.Fragment>
        <Flex>
          <FlexItem>
            <b>Task description</b>
          </FlexItem>
        </Flex>
        <Flex style={{ paddingBottom: '8px' }}>
          <FlexItem style={{ width: '100%' }}>
            <TextContent>
              <Text component={TextVariants.p}>{description}</Text>
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
            <b>Systems to run tasks on</b>
          </Text>
        </TextContent>
        <Alert variant="info" isInline title={INFO_ALERT_SYSTEMS} />
        <InventoryPage selectedIds={selectedSystems} setSelectedIds={setSelectedSystems} />
      </React.Fragment>
    </Modal>
  );
};

export default RunTaskModal;
