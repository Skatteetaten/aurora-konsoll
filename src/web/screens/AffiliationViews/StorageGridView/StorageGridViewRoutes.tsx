import MessageBar from '@skatteetaten/frontend-components/MessageBar';
import Spinner from '@skatteetaten/frontend-components/Spinner';
import { Link } from '@skatteetaten/frontend-components/Link';
import React, { useEffect } from 'react';

import { Redirect, Route, Switch, useRouteMatch } from 'react-router';
import TabLink, { TabLinkWrapper } from '../../../components/TabLink';
import StorageGridView from './StorageGridView';
import { StorageGridViewRoutesProps } from './StorageGridViewRoutes.state';

export const StorageGridViewRoutes: React.FC<StorageGridViewRoutesProps> = ({
  affiliation,
  openshiftCluster,
  storageGridInformationUrl,
  getAreasAndTenant,
  getAreas,
  isFetchingAreas,
  isFetchingAreasAndTenant,
  areasAndTenant,
}) => {
  useEffect(() => {
    getAreasAndTenant(affiliation);
  }, [affiliation, getAreasAndTenant]);

  const match = useRouteMatch();
  if (!match) {
    return null;
  }

  if (isFetchingAreasAndTenant) {
    return <Spinner />;
  }

  if (areasAndTenant?.isTenantRegistered === false) {
    return (
      <Switch>
        <Redirect exact from={`${match.url}/active`} to={match.url} />
        <Route exact path={`${match.url}`}>
          <MessageBar size="large">
            Tenant er ikke registert for tilhørighet <b>{affiliation}</b> i
            cluster <b>{openshiftCluster}</b>. Se:
            <Link
              text="Registrere StorageGrid S3 Tenant"
              path={storageGridInformationUrl}
            />
            .
          </MessageBar>
        </Route>
      </Switch>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <TabLinkWrapper>
        <TabLink to={`${match.url}/active`}>Aktive Områder</TabLink>
      </TabLinkWrapper>
      <Switch>
        <Redirect exact from={match.url} to={`${match.url}/active`} />
        <Route exact path={`${match.url}/active`}>
          <StorageGridView
            activeAreas={areasAndTenant?.activeAreas}
            getAreas={() => getAreas(affiliation)}
            isFetchingAreas={isFetchingAreas}
          />
        </Route>
      </Switch>
    </div>
  );
};
