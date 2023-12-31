import '@testing-library/jest-dom';

import React from 'react';
import axios from 'axios';
import { usePermissions } from '@redhat-cloud-services/frontend-components-utilities/RBACHook';
import { render, screen, waitFor } from '@testing-library/react';

import RecommendationsPage from '../RecommendationsPage';

jest.mock('@redhat-cloud-services/frontend-components-utilities/RBACHook', () => ({
  usePermissions: jest.fn(),
}));
jest.mock('axios');

describe('RecommendationsPage', () => {
  beforeEach(() => {
    usePermissions.mockImplementation(() => ({ hasAccess: true, isLoading: false }));
  });

  it('should render table with recommendations', async () => {
    const mockData = {
      data: [
        {
          rule_id: '1',
          description: 'This is a test recommendation',
          publish_date: '2021-01-01',
          impacted_systems_count: 1,
          playbook_count: 1,
        },
        {
          rule_id: '2',
          description: 'This is another test recommendation',
          publish_date: '2021-01-02',
          impacted_systems_count: 2,
          playbook_count: 0,
        },
      ],
      meta: {
        count: 2,
      },
    };
    axios.get.mockImplementation(() => Promise.resolve(mockData));
    render(<RecommendationsPage />);
    await waitFor(() => {
      expect(screen.getByText('This is a test recommendation')).toBeInTheDocument();
      expect(screen.getByText('This is another test recommendation')).toBeInTheDocument();
    });
  });

  it('should not render the table when no recommendations were found', async () => {
    const mockData = {
      data: [],
      meta: {
        count: 0,
      },
    };
    axios.get.mockImplementation(() => Promise.resolve(mockData));
    render(<RecommendationsPage />);
    // wait for the api call to finish and expect "No recommendations found" to be displayed
    await waitFor(() => {
      expect(screen.getByText('No recommendations found')).toBeInTheDocument();
    });
  });

  it('should render correctly without permissions', async () => {
    usePermissions.mockImplementation(() => ({ hasAccess: false, isLoading: false }));
    render(<RecommendationsPage />);
    await waitFor(() => {
      expect(screen.getByText('You do not have access to Upgrades')).toBeInTheDocument();
    });
  });
});
