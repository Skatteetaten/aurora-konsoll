import * as React from 'react';

import Button from 'aurora-frontend-react-komponenter/Button';

export interface ISchemaProps {
  onFetch: (host: string, port: string) => any;
  result: any;
}

export const schema = (props: ISchemaProps) => {
  const { onFetch, result } = props;

  const handleIncrement = () => {
    onFetch('vg.no', '80');
  };
  // tslint:disable-next-line:no-console
  console.log(result);
  return (
    <div>
      <Button onClick={handleIncrement}>fetch</Button>
    </div>
  );
};
