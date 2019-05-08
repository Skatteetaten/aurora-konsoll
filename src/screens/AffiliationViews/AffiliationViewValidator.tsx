import * as React from 'react';

import {
  IApplicationDeployment,
  IApplicationDeploymentDetails,
  IUserAndAffiliations
} from 'models/ApplicationDeployment';
import { IErrorState } from 'models/StateManager/ErrorStateManager';
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
  errors: IErrorState;
  isFetchingAffiliations: boolean;
  addError: (error: Error) => void;
  getNextError: () => void;
  closeError: (id: number) => void;
  refreshAffiliations: (affiliations: string[]) => void;
  findAllApplicationDeployments: (affiliations: string[]) => void;
  getUserSettings: () => IUserSettings;
  allApplicationDeployments: IApplicationDeployment[];
  isFetchingAllApplicationDeployments: boolean;
  updateUserSettings: (userSettings: IUserSettings) => boolean;
  findApplicationDeploymentDetails: (
    id: string
  ) => IApplicationDeploymentDetails;
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
    const { affiliation, currentUser, match, type, errors } = this.props;

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
          errors={errors}
          addError={this.props.addError}
          getNextError={this.props.getNextError}
          closeError={this.props.closeError}
          refreshAffiliations={this.props.refreshAffiliations}
          isFetchingAffiliations={this.props.isFetchingAffiliations}
          findAllApplicationDeployments={
            this.props.findAllApplicationDeployments
          }
          allApplicationDeployments={this.props.allApplicationDeployments}
          isFetchingAllApplicationDeployments={
            this.props.isFetchingAllApplicationDeployments
          }
          getUserSettings={this.props.getUserSettings}
          updateUserSettings={this.props.updateUserSettings}
          findApplicationDeploymentDetails={
            this.props.findApplicationDeploymentDetails
          }
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
