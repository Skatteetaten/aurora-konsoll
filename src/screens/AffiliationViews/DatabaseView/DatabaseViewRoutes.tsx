import * as React from 'react';

import { SchemaConnected } from './schemaConnected';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router';
import TabLink, { TabLinkWrapper } from '../../../components/TabLink';
import { RestorableSchemaConnected } from './restorableSchemaConnected';

export interface IDatabaseViewRoutesProps {
  affiliation: string;
}

export const DatabaseViewRoutes: React.FC<IDatabaseViewRoutesProps> = ({
  affiliation,
}) => {
  const match = useRouteMatch();
  if (!match) {
    return null;
  }

  return (
    <>
      <TabLinkWrapper>
        <TabLink to={`${match.url}/schemas`}>Aktive Skjema</TabLink>
        <TabLink to={`${match.url}/restorableSchemas`}>
          Gjenopprett Skjema
        </TabLink>
      </TabLinkWrapper>
      <Switch>
        <Redirect exact={true} from={match.url} to={`${match.url}/schemas`} />
        <Route path={`${match.url}/schemas`}>
          <SchemaConnected affiliation={affiliation} />
        </Route>
        <Route path={`${match.url}/restorableSchemas`}>
          <RestorableSchemaConnected affiliation={affiliation} />
        </Route>
      </Switch>
    </>
  );
};
