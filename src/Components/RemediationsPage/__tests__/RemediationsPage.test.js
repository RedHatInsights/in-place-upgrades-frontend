import '@testing-library/jest-dom';

import React from 'react';
import axios from 'axios';
import { usePermissions } from '@redhat-cloud-services/frontend-components-utilities/RBACHook';
import { render, screen, waitFor } from '@testing-library/react';

import RemediationsPage from '../RemediationsPage';

jest.mock('@redhat-cloud-services/frontend-components-utilities/RBACHook', () => ({
  usePermissions: jest.fn(),
}));
jest.mock('axios');

describe('RemediationsPage', () => {
  beforeEach(() => {
    usePermissions.mockImplementation(() => ({ hasAccess: true, isLoading: false }));
  });

  it('should render table with remediations', async () => {
    const mockData = {
      data: [
        {
          id: '1',
          name: 'This is a test remediation',
          updated_at: '2021-01-01',
          system_count: 1,
          resolved_count: 1,
        },
        {
          id: '2',
          name: 'This is another test remediation',
          updated_at: '2021-01-02',
          system_count: 2,
          resolved_count: 0,
        },
      ],
      meta: {
        count: 2,
      },
    };
    axios.get.mockImplementation(() => Promise.resolve(mockData));
    render(<RemediationsPage />);
    await waitFor(() => {
      expect(screen.getByText('This is a test remediation')).toBeInTheDocument();
      expect(screen.getByText('This is another test remediation')).toBeInTheDocument();
    });
  });

  it('should not render the table when no remediations were found', async () => {
    const mockData = {
      data: [],
      meta: {
        count: 0,
      },
    };
    axios.get.mockImplementation(() => Promise.resolve(mockData));
    render(<RemediationsPage />);
    // wait for the api call to finish and expect "No remeediations found" to be displayed
    await waitFor(() => {
      expect(screen.getByText('No remediations playbooks yet')).toBeInTheDocument();
    });
  });

  it('should render correctly without permissions', async () => {
    usePermissions.mockImplementation(() => ({ hasAccess: false, isLoading: false }));
    render(<RemediationsPage />);
    await waitFor(() => {
      expect(screen.getByText('You do not have access to Upgrades')).toBeInTheDocument();
    });
  });
});
