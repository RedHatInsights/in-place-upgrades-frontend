import '@testing-library/jest-dom';

import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { fireEvent, render, screen } from '@testing-library/react';

import configureStore from 'redux-mock-store';

import LandingPage from '../LandingPage';

test('expect to render title and clicable tabs', () => {
  let mockStore = configureStore();
  let props;
  const store = mockStore(props);
  const mockUsedNavigate = jest.fn();
  jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockUsedNavigate,
  }));

  render(
    <Provider store={store}>
      <BrowserRouter>
        <LandingPage />
      </BrowserRouter>
    </Provider>
  );
  expect(screen.getByRole('heading')).toHaveTextContent('Upgrades');

  // Tabs exist
  ['Inventory', 'Pre-upgrade', 'Upgrade', 'Recommendations'].forEach((tab) => {
    const foundTab = screen.getByText(tab).closest('button');
    expect(foundTab).not.toBeNull();
  });

  // Tabs can be changed
  const inventoryTab = screen.getByText('Inventory').closest('button');
  ['Pre-upgrade', 'Upgrade', 'Recommendations'].forEach((tab) => {
    const foundTab = screen.getByText(tab).closest('button');
    fireEvent.click(foundTab);
    expect(inventoryTab).toHaveAttribute('aria-selected', 'false');
    expect(foundTab).toHaveAttribute('aria-selected', 'true');

    fireEvent.click(inventoryTab);
    expect(inventoryTab).toHaveAttribute('aria-selected', 'true');
    expect(foundTab).toHaveAttribute('aria-selected', 'false');
  });

  // Post-upgrade is disabled
  const postUpgradeTab = screen.getByText('Post-upgrade').closest('button');
  expect(postUpgradeTab).toHaveAttribute('disabled');
});
