import * as React from 'react';

import Button from 'aurora-frontend-react-komponenter/Button';
import { IDatabaseSchemas } from 'models/schemas';

export interface ISchemaProps {
  onFetch: (affiliations: string[]) => any;
  items: IDatabaseSchemas;
  isLoading: boolean;
  affiliation: string;
}

export const schema = (props: ISchemaProps) => {
  const { onFetch, items, isLoading, affiliation } = props;

  const handleFetchDatabaseSchemas = () => {
    onFetch([affiliation]);
  };
  // tslint:disable-next-line:no-console
  console.log(items && items.databaseSchemas);
  // tslint:disable-next-line:no-console
  console.log(isLoading);

  return (
    <div>
      <Button onClick={handleFetchDatabaseSchemas}>fetch</Button>
    </div>
  );
};
