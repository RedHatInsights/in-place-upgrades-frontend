import React from 'react';
import { Bullseye, Spinner } from '@patternfly/react-core';

type LoadingProps = {
  children: JSX.Element;
  isLoading: boolean;
};

const Loading = ({ children, isLoading }: LoadingProps): JSX.Element => {
  return isLoading ? (
    <Bullseye>
      <Spinner isSVG />
    </Bullseye>
  ) : (
    children
  );
};

export default Loading;
