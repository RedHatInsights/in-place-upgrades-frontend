import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import LandingPage from './LandingPage';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';

test('expect to render title and clicable tabs', () => {
  const mockUsedNavigate = jest.fn();
  jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockUsedNavigate,
  }));

  // Mock global insights variable (ChromeAPI)
  global.insights = {
    chrome: {
      appAction: () => null,
    },
  };

  render(
    <BrowserRouter>
      <LandingPage />
    </BrowserRouter>
  );
  expect(screen.getByRole('heading')).toHaveTextContent('Upgrades');

  // Tabs exist
  ['Inventory', 'Pre-upgrade', 'Upgrade', 'Remediations'].forEach((tab) => {
    const foundTab = screen.getByText(tab).closest('button');
    expect(foundTab).not.toBeNull();
  });

  // Tabs can be changed
  const inventoryTab = screen.getByText('Inventory').closest('button');
  ['Pre-upgrade', 'Upgrade', 'Remediations'].forEach((tab) => {
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
