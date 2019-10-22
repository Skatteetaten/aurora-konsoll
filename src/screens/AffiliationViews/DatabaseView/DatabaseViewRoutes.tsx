import * as React from 'react';

import { SchemaConnected } from './schemaConnected';
import { Switch, Route, useRouteMatch, Redirect } from 'react-router';

export interface IDatabaseViewRoutesProps {
  affiliation: string;
}

export const DatabaseViewRoutes: React.FC<IDatabaseViewRoutesProps> = ({
  affiliation
}) => {
  const match = useRouteMatch();
  if (!match) {
    return null;
  }

  return (
    <Switch>
      <Redirect exact={true} from={match.url} to={`${match.url}/schemas`} />
      <Route path={`${match.url}/schemas`}>
        <SchemaConnected affiliation={affiliation} />
      </Route>
    </Switch>
  );
};
