import React, { useEffect } from 'react';

import { Redirect, Route, Switch, useRouteMatch } from 'react-router';
import TabLink, { TabLinkWrapper } from '../../../components/TabLink';
import DnsView from './DnsView';
import { DnsViewRoutesProps } from './DnsViewRoutes.state';
import IntegrationDisabledInformation from './IntegrationDisabledInformation';

export const DnsViewRoutes: React.FC<DnsViewRoutesProps> = ({
  affiliation,
  azure,
  fetchCnames,
  isFetching,
  onPrem,
}) => {
  useEffect(() => {
    fetchCnames(affiliation);
  }, [affiliation, fetchCnames]);

  const match = useRouteMatch();
  if (!match) {
    return null;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <TabLinkWrapper>
        <TabLink to={`${match.url}/onprem`}>DNS entries (On Premise)</TabLink>
        <TabLink to={`${match.url}/azure`}>DNS entries (Azure)</TabLink>
      </TabLinkWrapper>
      <Switch>
        <Redirect exact from={match.url} to={`${match.url}/onprem`} />
        <Route exact path={`${match.url}/onprem`}>
          <DnsView
            affiliation={affiliation}
            isFetching={isFetching}
            onFetch={fetchCnames}
            cnames={{ items: onPrem || [], type: 'onPrem' }}
          />
        </Route>
        <Route exact path={`${match.url}/azure`}>
          {azure ? (
            <DnsView
              affiliation={affiliation}
              isFetching={isFetching}
              onFetch={fetchCnames}
              cnames={{ items: azure, type: 'azure' }}
            />
          ) : (
            <IntegrationDisabledInformation />
          )}
        </Route>
      </Switch>
    </div>
  );
};
