import React from 'react';
import { CardBody, CardFooter, CardTitle, Card as PFCard } from '@patternfly/react-core';

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
