import React from 'react';
import '@testing-library/jest-dom';

global.React = React;
global.window = Object.create(window);
global.window.insights = {
  ...(window.insights || {}),
  chrome: {
    auth: {
      getUser: () =>
        new Promise((res) =>
          res({
            identity: {
              account_number: '0',
              type: 'User',
            },
            entitlements: {
              insights: {
                is_entitled: true,
              },
            },
          })
        ),
    },
    isBeta: jest.fn(),
    getUserPermissions: () => Promise.resolve(),
  },
};

global.window.__scalprum__ = {
  scalprumOptions: {
    cacheTimeout: 999999,
  },
  appsConfig: {
    inventory: {
      manifestLocation: 'https://console.stage.redhat.com/apps/inventory/fed-mods.json?ts=1643875037626',
      module: 'inventory#./RootApp',
      name: 'inventory',
    },
  },
  factories: {
    inventory: {
      expiration: new Date('01-01-3000'),
      modules: {
        './InventoryTable': {
          __esModule: true,
          default: () => (
            <div>
              <h1>Inventory mock</h1>
            </div>
          ),
        },
      },
    },
  },
};

jest.mock('@redhat-cloud-services/frontend-components/useChrome', () => ({
  __esModule: true,
  default: () => ({
    updateDocumentTitle: jest.fn(),
    appAction: jest.fn(),
    appObjectId: jest.fn(),
    on: jest.fn(),
    isBeta: jest.fn(),
  }),
  useChrome: () => ({
    isBeta: jest.fn(),
    chrome: jest.fn(),
    updateDocumentTitle: jest.fn(),
  }),
}));
