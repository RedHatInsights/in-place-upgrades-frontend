import React from 'react';
import { Card as PFCard, CardBody, CardFooter, CardTitle } from '@patternfly/react-core';

const Card = ({ title, body, footer, ...props }) => {
  return (
    <PFCard {...props}>
      <CardTitle>{title}</CardTitle>
      <CardBody>{body}</CardBody>
      <CardFooter>{footer}</CardFooter>
    </PFCard>
  );
};

export default Card;
