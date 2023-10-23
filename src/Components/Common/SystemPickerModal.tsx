import React, { useState } from 'react';
import { Button, Modal } from '@patternfly/react-core';

import InventoryPage from '../InventoryPage/InventoryPage';

type SystemPickerModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSubmit: (selectedSystems: string[]) => Promise<void>;
  title: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  submitText: string;
  inventoryProps?: {
    recommendationRule: string;
  };
};

export const SystemPickerModal = ({ isOpen, setIsOpen, onSubmit, title, header, footer, submitText, inventoryProps }: SystemPickerModalProps) => {
  const [selectedSystems, setSelectedSystems] = useState([] as string[]);
  const [isExecuting, setIsExecuting] = useState(false);

  const submitTask = async (selectedSystems) => {
    setIsExecuting(true);
    await onSubmit(selectedSystems);
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
          key="system-picker-submit-button"
          variant="primary"
          onClick={() => submitTask(selectedSystems)}
          isDisabled={selectedSystems.length === 0 || isExecuting}
          isLoading={isExecuting}
        >
          {submitText}
        </Button>,
        <Button key="system-picker-cancel-button" variant="link" onClick={() => setIsOpen(false)} isDisabled={isExecuting}>
          Cancel
        </Button>,
      ]}
    >
      <React.Fragment>
        {header}
        <InventoryPage selectedIds={selectedSystems} setSelectedIds={setSelectedSystems} {...inventoryProps} />
        {footer}
      </React.Fragment>
    </Modal>
  );
};

export default SystemPickerModal;
