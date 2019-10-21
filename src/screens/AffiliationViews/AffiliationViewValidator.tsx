import React, { useEffect } from 'react';
import { useRouteMatch, useHistory, Route, Switch } from 'react-router-dom';

import {
  IApplicationDeployment,
  IUserAndAffiliations
} from 'models/ApplicationDeployment';
import { IUserSettings } from 'models/UserSettings';
import { RouteComponentProps } from 'react-router-dom';
import AffiliationSelector from './AffiliationSelector';
import { DeploymentView } from './DeploymentView/DeploymentView';
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
  const match = useRouteMatch<{ affiliation: string; screen: string }>();

  const updateUrlWithQuery = (query: string) => {
    history.push(query);
  };

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

  if (!match) {
    // TODO: fix
    return <p>test</p>;
  }

  if (currentUser.affiliations.length === 0) {
    return null;
  }

  return (
    <Switch>
      <Route path="/a/_/:screen">
        <AffiliationSelector
          title={`Velkommen, ${currentUser.user}`}
          affiliations={currentUser.affiliations}
          onSelectAffiliation={onAffiliationValidated}
        />
      </Route>
      <Route path="/a/:affiliation/deployments">
        <DeploymentView
          affiliation={affiliation || ''}
          matchPath={match.path + '/deployments'}
          matchUrl={match.url + '/deployments'}
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
        <DatabaseViewController affiliation={affiliation || ''} />;
      </Route>
      <Route path="/a/:affiliation/webseal">
        <WebsealViewController affiliation={affiliation || ''} />;
      </Route>
    </Switch>
  );
};
