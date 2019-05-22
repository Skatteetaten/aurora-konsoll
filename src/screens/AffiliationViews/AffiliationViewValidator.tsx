import * as React from 'react';

import {
  IApplicationDeployment,
  IUserAndAffiliations
} from 'models/ApplicationDeployment';
import { IUserSettings } from 'models/UserSettings';
import { RouteComponentProps } from 'react-router-dom';
import { MenuType } from 'screens/App';
import AffiliationSelector from './AffiliationSelector';
import { AffiliationViewControllerWithApi } from './AffiliationViewController';
import DatabaseViewController from './DatabaseView/DatabaseViewController';
import WebsealViewController from './WebsealView/WebsealViewController';

export type AffiliationRouteProps = RouteComponentProps<{
  affiliation: string;
}>;

interface IAffiliationViewValidatorProps extends AffiliationRouteProps {
  affiliation?: string;
  type: MenuType;
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

class AffiliationViewValidator extends React.Component<
  IAffiliationViewValidatorProps
> {
  public validateAndSetAffiliation = () => {
    const {
      affiliation,
      onAffiliationValidated,
      currentUser,
      match
    } = this.props;

    const pathAffiliation = match.params.affiliation;
    const isValidAffiliation = currentUser.affiliations.find(
      a => a === pathAffiliation
    );
    if (isValidAffiliation && affiliation !== pathAffiliation) {
      onAffiliationValidated(pathAffiliation);
    }
  };

  public updateUrlWithQuery = (query: string) => {
    this.props.history.push(query);
  };

  public componentDidUpdate() {
    this.validateAndSetAffiliation();
  }

  public componentDidMount() {
    this.validateAndSetAffiliation();
  }

  public render() {
    const {
      affiliation,
      currentUser,
      match,
      type,
      refreshAffiliations,
      isFetchingAffiliations,
      findAllApplicationDeployments,
      allApplicationDeployments,
      isFetchingAllApplicationDeployments,
      getUserSettings,
      updateUserSettings,
      onAffiliationValidated,
      userSettings
    } = this.props;

    if (currentUser.affiliations.length === 0) {
      return false;
    }
    if (match.params.affiliation === '_') {
      let title = '';
      let createLink = (a: string) => '';
      if (type === MenuType.DEPLOYMENTS) {
        title = `Velkommen ${currentUser.user}`;
        createLink = (a: string) => `/a/${a}/deployments`;
      } else if (type === MenuType.DATABASE) {
        title = 'Velg tilhørighet';
        createLink = (a: string) => `/db/${a}/databaseSchemas`;
      } else if (type === MenuType.WEBSEAL) {
        title = 'Velg tilhørighet';
        createLink = (a: string) => `/w/${a}/webseal`;
      }

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
    if (type === MenuType.DEPLOYMENTS) {
      return (
        <AffiliationViewControllerWithApi
          affiliation={affiliation}
          matchPath={match.path}
          matchUrl={match.url}
          updateUrlWithQuery={this.updateUrlWithQuery}
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
      );
    } else if (type === MenuType.DATABASE) {
      return <DatabaseViewController affiliation={affiliation} />;
    } else {
      return <WebsealViewController affiliation={affiliation} />;
    }
  }
}

export default AffiliationViewValidator;
