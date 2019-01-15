import * as React from 'react';

import Button from 'aurora-frontend-react-komponenter/Button';

export interface ISchemaProps {
  onFetch: (host: string, port: string) => any;
}

export const schema = (props: ISchemaProps) => {
  const { onFetch } = props;

  const handleIncrement = () => {
    onFetch('vg.no', '80');
  };

  return (
    <div>
      <Button onClick={handleIncrement}>øk med en</Button>
    </div>
  );
};
