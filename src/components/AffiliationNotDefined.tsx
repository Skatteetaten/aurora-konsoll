import * as React from 'react';

interface IAffiliationNotDefinedProps {
  message: string;
}

const AffiliationNotDefined = ({ message }: IAffiliationNotDefinedProps) => (
  <>
    <h3>{message}</h3>
  </>
);

export default AffiliationNotDefined;
