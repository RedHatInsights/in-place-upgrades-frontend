import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { usePermissions } from '@redhat-cloud-services/frontend-components-utilities/RBACHook';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import configureStore from 'redux-mock-store';

import TasksPage from './TasksPage';

jest.mock('@redhat-cloud-services/frontend-components-utilities/RBACHook', () => ({
  usePermissions: jest.fn(),
}));

const executedTasksData = {
  meta: { count: 246 },
  data: [
    {
      id: 6131,
      name: 'RHEL preupgrade analysis utility',
      task_slug: 'leapp-preupgrade',
      task_title: 'RHEL pre-upgrade analysis utility',
      task_description:
        'For connected systems running versions of RHEL 7 or RHEL 8, the RHEL pre-upgrade analysis will predict repository conflicts and application compatibility with future versions before you upgrade.  Run this task to understand the impact of an upgrade on your fleet and make a remediation plan before your maintenance window begins.',
      initiated_by: 'leappbot',
      start_time: '2023-10-20T10:42:44.398255Z',
      end_time: null,
      status: 'Running',
      systems_count: 2,
      alerts_count: 0,
    },
    {
      id: 6142,
      name: 'RHEL preupgrade analysis utility',
      task_slug: 'leapp-preupgrade',
      task_title: 'RHEL pre-upgrade analysis utility',
      task_description:
        'For connected systems running versions of RHEL 7 or RHEL 8, the RHEL pre-upgrade analysis will predict repository conflicts and application compatibility with future versions before you upgrade.  Run this task to understand the impact of an upgrade on your fleet and make a remediation plan before your maintenance window begins.',
      initiated_by: 'leappbot',
      start_time: '2023-10-20T12:36:23.325371Z',
      end_time: null,
      status: 'Completed',
      systems_count: 3,
      alerts_count: 0,
    },
    {
      id: 457,
      name: 'RHEL preupgrade analysis utility',
      task_slug: 'leapp-preupgrade',
      task_title: 'RHEL pre-upgrade analysis utility',
      task_description:
        'For connected systems running versions of RHEL 7 or RHEL 8, the RHEL pre-upgrade analysis will predict repository conflicts and application compatibility with future versions before you upgrade.  Run this task to understand the impact of an upgrade on your fleet and make a remediation plan before your maintenance window begins.',
      initiated_by: 'leappbot',
      start_time: '2023-01-11T12:12:42.909154Z',
      end_time: '2023-01-11T13:20:03.698275Z',
      status: 'Completed',
      systems_count: 1,
      alerts_count: 0,
    },
    {
      id: 472,
      name: 'RHEL preupgrade analysis utility',
      task_slug: 'leapp-preupgrade',
      task_title: 'RHEL pre-upgrade analysis utility',
      task_description:
        'For connected systems running versions of RHEL 7 or RHEL 8, the RHEL pre-upgrade analysis will predict repository conflicts and application compatibility with future versions before you upgrade.  Run this task to understand the impact of an upgrade on your fleet and make a remediation plan before your maintenance window begins.',
      initiated_by: 'leappbot',
      start_time: '2023-01-16T11:28:33.010484Z',
      end_time: '2023-01-16T11:37:48.859056Z',
      status: 'Completed',
      systems_count: 2,
      alerts_count: 1,
    },
    {
      id: 664,
      name: 'RHEL preupgrade analysis utility',
      task_slug: 'leapp-preupgrade',
      task_title: 'RHEL pre-upgrade analysis utility',
      task_description:
        'For connected systems running versions of RHEL 7 or RHEL 8, the RHEL pre-upgrade analysis will predict repository conflicts and application compatibility with future versions before you upgrade.  Run this task to understand the impact of an upgrade on your fleet and make a remediation plan before your maintenance window begins.',
      initiated_by: 'leappbot',
      start_time: '2023-02-01T11:27:45.876624Z',
      end_time: '2023-02-01T11:27:45.876624Z',
      status: 'Completed',
      systems_count: 3,
      alerts_count: 3,
    },
  ],
};

const taskSlug = 'leapp-preupgrade';
const taskTitle = 'RHEL preupgrade analysis utility';
const taskRunButtonText = 'Run pre-upgrade task';

const taskInfo = {
  slug: taskSlug,
  title: taskTitle,
  type: 'Ansible',
  description:
    'For connected systems running versions of RHEL 7 or RHEL 8, the RHEL pre-upgrade analysis will predict repository conflicts and application compatibility with future versions before you upgrade.  Run this task to understand the impact of an upgrade on your fleet and make a remediation plan before your maintenance window begins.',
  publish_date: '2022-10-05T00:00:00Z',
  parameters: [],
};

jest.mock('../../api', () => ({
  tasksFetchExecutedTasks: jest.fn(() => Promise.resolve(executedTasksData)),
  tasksFetchTaskInfo: jest.fn(() => Promise.resolve(taskInfo)),
  isError: jest.fn(() => false),
}));

describe('TasksPage', () => {
  let mockStore = configureStore();
  let props;
  const store = mockStore(props);

  beforeEach(() => {
    usePermissions.mockImplementation(() => ({ hasAccess: true, isLoading: false }));
  });

  it('renders correctly with mock data', async () => {
    const { asFragment, getByText, findAllByText } = render(
      <Provider store={store}>
        <Router>
          <TasksPage slug={taskSlug} />
        </Router>
      </Provider>
    );
    const regexPattern = /#\d+\sRHEL pre-upgrade analysis utility/;
    const matchedElements = await findAllByText(regexPattern);
    const runTaskButton = getByText(taskRunButtonText);

    expect(asFragment()).toMatchSnapshot();
    // Check that all tasks titles are present
    expect(runTaskButton).toBeInTheDocument();
    // Check if the run task button is in the document
    expect(matchedElements.length).toBe(executedTasksData.data.length);
  });

  it('displays a loading spinner while fetching data', async () => {
    usePermissions.mockImplementation(() => ({ hasAccess: true, isLoading: true }));

    const { getByTestId } = render(
      <Provider store={store}>
        <Router>
          <TasksPage slug={taskSlug} />
        </Router>
      </Provider>
    );

    const loadingSpinner = getByTestId('loading-spinner');
    expect(loadingSpinner).toBeInTheDocument();
  });

  it('should render correctly without permissions', async () => {
    usePermissions.mockImplementation(() => ({ hasAccess: false, isLoading: false }));
    render(
      <Provider store={store}>
        <Router>
          <TasksPage slug={taskSlug} />
        </Router>
      </Provider>
    );
    await waitFor(() => {
      expect(screen.getByText('You do not have access to Upgrades')).toBeInTheDocument();
    });
  });

  it('displays correct task status', async () => {
    const { findAllByTitle, findAllByText } = render(
      <Provider store={store}>
        <Router>
          <TasksPage slug={taskSlug} />
        </Router>
      </Provider>
    );

    const runningTexts = await findAllByText('Running');
    expect(runningTexts.length).toBe(1);
    const completedTexts = await findAllByText('Completed');
    expect(completedTexts.length).toBe(4);

    const noAlertsFound = await findAllByTitle('No Alerts Found');
    expect(noAlertsFound.length).toBe(2);
    const systemAlertsFound1 = await findAllByTitle('System Alerts Found: 1');
    const systemAlertsFound3 = await findAllByTitle('System Alerts Found: 3');
    expect(systemAlertsFound1.length).toBe(1);
    expect(systemAlertsFound3.length).toBe(1);
  });

  it('opens SystemPickerModal on button click', async () => {
    usePermissions.mockImplementation(() => ({ hasAccess: true, isLoading: false }));

    const { findByRole, findAllByText } = render(
      <Provider store={store}>
        <Router>
          <TasksPage slug={taskSlug} />
        </Router>
      </Provider>
    );

    const runTaskButtons = await findAllByText(taskRunButtonText);
    expect(runTaskButtons.length).toBe(1);
    const runTaskButton = runTaskButtons[0];

    fireEvent.click(runTaskButton);

    const modal = await findByRole('dialog');
    expect(modal).toBeInTheDocument();
  });
});
