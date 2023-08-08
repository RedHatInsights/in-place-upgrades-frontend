import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

import { Bullseye, Spinner } from '@patternfly/react-core';

const SamplePage = lazy(() => import(/* webpackChunkName: "SamplePage" */ './Routes/SamplePage/SamplePage'));
// const OopsPage = lazy(() => import(/* webpackChunkName: "OopsPage" */ './Routes/OopsPage/OopsPage'));
// const NoPermissionsPage = lazy(() => import(/* webpackChunkName: "NoPermissionsPage" */ './Routes/NoPermissionsPage/NoPermissionsPage'));

/**
 * the Switch component changes routes depending on the path.
 *
 * Route properties:
 *      exact - path must match exactly,
 *      path - https://prod.foo.redhat.com:1337/insights/advisor/rules
 *      component - component to be rendered when a route has been chosen.
 */
const CustomRoutes = () => (
  <Suspense
    fallback={
      <Bullseye>
        <Spinner />
      </Bullseye>
    }
  >
    <Routes>
      <Route path="/" element={<SamplePage />} />

      {/* NOTE: Use below routes for reference for 500 and 403 */}
      {/* <Route path="/" element={<OopsPage />} /> */}
      {/* <Route path="/" element={<NoPermissionsPage />} /> */}

      {/* NOTE: Finally, catch all unmatched routes */}
      {/* <Route>
        <Redirect to="/" />
      </Route> */}
    </Routes>
  </Suspense>
);

export default CustomRoutes;
