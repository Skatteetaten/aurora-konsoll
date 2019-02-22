import * as React from 'react';

import { connect } from 'react-redux';

import { IUserAndAffiliations } from 'models/ApplicationDeployment';
import { RouteComponentProps } from 'react-router-dom';
import { MenuType } from 'screens/App';
import { RootState } from 'store/types';
import AffiliationSelector from './AffiliationSelector';
import { AffiliationViewControllerWithApi } from './AffiliationViewController';
import DatabaseViewController from './DatabaseView/DatabaseViewController';

export type AffiliationRouteProps = RouteComponentProps<{
  affiliation: string;
}>;

interface IAffiliationViewValidatorProps extends AffiliationRouteProps {
  affiliation?: string;
  type: MenuType;
  onAffiliationValidated: (affiliation: string) => void;
  currentUser: IUserAndAffiliations;
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
    const { affiliation, currentUser, match, type } = this.props;

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
        />
      );
    } else {
      return <DatabaseViewController affiliation={affiliation} />;
    }
  }
}

const mapStateToProps = (state: RootState) => ({
  currentUser: state.startup.currentUser
});

const AffiliationViewValidatorConnected = connect(
  mapStateToProps,
  null
)(AffiliationViewValidator);

export default AffiliationViewValidatorConnected;
