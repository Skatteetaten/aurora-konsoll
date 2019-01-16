import * as React from 'react';

import Button from 'aurora-frontend-react-komponenter/Button';
import { INetdebugResult } from 'services/auroraApiClients';

export interface ISchemaProps {
  onFetch: (host: string, port: string) => any;
  error: boolean;
  items: INetdebugResult | null;
  isLoading: boolean;
}

export const schema = (props: ISchemaProps) => {
  const { onFetch, items, error, isLoading } = props;

  const handleIncrement = () => {
    onFetch('vg.no', '80');
  };
  // tslint:disable-next-line:no-console
  console.log(items && items.open);
  // tslint:disable-next-line:no-console
  console.log(error);
  // tslint:disable-next-line:no-console
  console.log(isLoading);
  return (
    <div>
      <Button onClick={handleIncrement}>fetch</Button>
    </div>
  );
};
