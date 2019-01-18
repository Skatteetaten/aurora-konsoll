import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { MenuType } from 'screens/App';
import AffiliationSelector from './AffiliationSelector';
import { AffiliationViewControllerWithApi } from './AffiliationViewController';

export type AffiliationRouteProps = RouteComponentProps<{
  affiliation: string;
}>;

interface IAffiliationViewValidatorProps extends AffiliationRouteProps {
  user: string;
  affiliation?: string;
  affiliations: string[];
  type: MenuType;
  onAffiliationValidated: (affiliation: string) => void;
}

class AffiliationViewValidator extends React.Component<
  IAffiliationViewValidatorProps
> {
  public validateAndSetAffiliation = () => {
    const {
      affiliation,
      affiliations,
      onAffiliationValidated,
      match
    } = this.props;

    const pathAffiliation = match.params.affiliation;
    const isValidAffiliation = affiliations.find(a => a === pathAffiliation);
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
    const { affiliation, affiliations, match, user, type } = this.props;

    if (affiliations.length === 0) {
      return false;
    }

    if (match.params.affiliation === '_') {
      let title = '';
      let createLink = (a: string) => '';
      if(type === MenuType.DEPLOYMENTS) {
        title = `Velkommen ${user}`;
        createLink = (a: string) => `/a/${a}/deployments`;
      } else if(type === MenuType.DATABASE) {
        title = 'Velg tilhørighet';
        createLink = (a: string) => `/db/${a}/databaseSchemas`;
      }

      return <AffiliationSelector title={title} createLink={createLink} affiliations={affiliations} />;
    }

    if (!affiliation) {
      return <p>{affiliation} er ikke en gyldig affiliation.</p>;
    }
    return (
      <AffiliationViewControllerWithApi
        affiliation={affiliation}
        matchPath={match.path}
        matchUrl={match.url}
        updateUrlWithQuery={this.updateUrlWithQuery}
      />
    );
  }
}

export default AffiliationViewValidator;
