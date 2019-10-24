import React, { useEffect } from 'react';
import { useRouteMatch, useHistory, Route, Switch } from 'react-router-dom';

import AffiliationSelector from './AffiliationSelector';
import { DeploymentView } from './DeploymentView/DeploymentView';
import { DatabaseViewRoutes } from './DatabaseView/DatabaseViewRoutes';
import WebsealViewController from './WebsealView/WebsealViewController';
import { AffiliationViewValidatorState } from './AffiliationViewValidatorConnected';

interface IAffiliationViewValidatorProps {
  affiliation?: string;
  onAffiliationValidated: (affiliation: string) => void;
}

type Props = IAffiliationViewValidatorProps & AffiliationViewValidatorState;

export const AffiliationViewValidator: React.FC<Props> = ({
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
    return null;
  }

  if (!affiliation) {
    return (
      <Route path="/a/_/:screen">
        <AffiliationSelector
          title={`Velkommen, ${currentUser.user}`}
          affiliations={currentUser.affiliations}
          onSelectAffiliation={onAffiliationValidated}
        />
      </Route>
    );
  }

  return (
    <Switch>
      <Route path="/a/:affiliation/deployments">
        <DeploymentView
          affiliation={affiliation}
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
      <Route path="/a/:affiliation/db">
        <DatabaseViewRoutes affiliation={affiliation} />
      </Route>
      <Route path="/a/:affiliation/webseal">
        <WebsealViewController affiliation={affiliation} />
      </Route>
    </Switch>
  );
};
