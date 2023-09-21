import React, { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Bullseye, Spinner } from '@patternfly/react-core';

const LandingPage = lazy(() => import('./Components/LandingPage/LandingPage'));

const CustomRoutes = () => (
  <Suspense
    fallback={
      <Bullseye>
        <Spinner />
      </Bullseye>
    }
  >
    <Routes>
      <Route path="*" element={<LandingPage />} />
    </Routes>
  </Suspense>
);

export default CustomRoutes;
