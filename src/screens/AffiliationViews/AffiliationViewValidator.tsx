import React, { useEffect } from 'react';
import { useRouteMatch, useHistory, Route, Switch } from 'react-router-dom';

import {
  IApplicationDeployment,
  IUserAndAffiliations
} from 'models/ApplicationDeployment';
import { IUserSettings } from 'models/UserSettings';
import { RouteComponentProps } from 'react-router-dom';
import AffiliationSelector from './AffiliationSelector';
import { AffiliationViewController } from './AffiliationViewController';
import DatabaseViewController from './DatabaseView/DatabaseViewController';
import WebsealViewController from './WebsealView/WebsealViewController';

export type AffiliationRouteProps = RouteComponentProps<{
  affiliation: string;
}>;

interface IAffiliationViewValidatorProps {
  affiliation?: string;
  onAffiliationValidated: (affiliation: string) => void;
  currentUser: IUserAndAffiliations;
  isFetchingAffiliations: boolean;
  refreshAffiliations: (affiliations: string[]) => void;
  findAllApplicationDeployments: (affiliations: string[]) => void;
  getUserSettings: () => void;
  allApplicationDeployments: IApplicationDeployment[];
  isFetchingAllApplicationDeployments: boolean;
  updateUserSettings: (userSettings: IUserSettings) => void;
  isUpdatingUserSettings: boolean;
  userSettings: IUserSettings;
  isRefreshingApplicationDeployment: boolean;
}

export const AffiliationViewValidator: React.FC<
  IAffiliationViewValidatorProps
> = ({
  affiliation,
  currentUser,
  refreshAffiliations,
  isFetchingAffiliations,
  findAllApplicationDeployments,
  allApplicationDeployments,
  isFetchingAllApplicationDeployments,
  getUserSettings,
  updateUserSettings,
  onAffiliationValidated,
  userSettings
}) => {
  const history = useHistory();
  const updateUrlWithQuery = (query: string) => {
    history.push(query);
  };

  const match = useRouteMatch<{ affiliation: string; screen: string }>();
  const pathAffiliation = (match && match.params.affiliation) || '';
  const isValidAffiliation = currentUser.affiliations.find(
    a => a === pathAffiliation
  );

  useEffect(() => {
    if (isValidAffiliation && affiliation !== pathAffiliation) {
      onAffiliationValidated(pathAffiliation);
    }
  }, [
    affiliation,
    isValidAffiliation,
    onAffiliationValidated,
    pathAffiliation
  ]);

  if (currentUser.affiliations.length === 0) {
    return null;
  }

  if (match && match.params.affiliation === '_') {
    let title = `Velkommen ${currentUser.user}`;
    const { screen } = match.params;
    let createLink = (a: string) => `/a/${a}/${screen}`;

    return (
      <AffiliationSelector
        title={title}
        createLink={createLink}
        affiliations={currentUser.affiliations}
        onSelectAffiliation={onAffiliationValidated}
      />
    );
  }
  if (!affiliation) {
    return <p>{affiliation} er ikke en gyldig affiliation.</p>;
  }

  if (!match) {
    return <p>test</p>;
  }

  return (
    <Switch>
      <Route path="/a/:affiliation/deployments">
        <AffiliationViewController
          affiliation={affiliation}
          matchPath={match.path}
          matchUrl={match.url}
          updateUrlWithQuery={updateUrlWithQuery}
          refreshAffiliations={refreshAffiliations}
          isFetchingAffiliations={isFetchingAffiliations}
          findAllApplicationDeployments={findAllApplicationDeployments}
          allApplicationDeployments={allApplicationDeployments}
          isFetchingAllApplicationDeployments={
            isFetchingAllApplicationDeployments
          }
          getUserSettings={getUserSettings}
          updateUserSettings={updateUserSettings}
          userSettings={userSettings}
        />
      </Route>
      <Route path="/a/:affiliation/databaseSchemas">
        <DatabaseViewController affiliation={affiliation} />;
      </Route>
      <Route path="/a/:affiliation/webseal">
        <WebsealViewController affiliation={affiliation} />;
      </Route>
    </Switch>
  );
};
