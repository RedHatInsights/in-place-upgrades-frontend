import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { getBaseName } from '@redhat-cloud-services/frontend-components-utilities/helpers';

import logger from 'redux-logger';

import App from './App';
import { init, RegistryContext } from './store';

const AppEntry = () => {
  const registry = init(...(process.env.NODE_ENV !== 'production' ? [logger] : []));
  return (
    <RegistryContext.Provider value={{ getRegistry: () => registry }}>
      <Provider store={registry.getStore()}>
        <Router basename={getBaseName(window.location.pathname)}>
          <App />
        </Router>
      </Provider>
    </RegistryContext.Provider>
  );
};

export default AppEntry;
