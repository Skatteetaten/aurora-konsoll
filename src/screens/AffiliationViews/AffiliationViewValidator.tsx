import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import AffiliationSelector from './AffiliationSelector';
import { AffiliationViewControllerWithApi } from './AffiliationViewController';

export type AffiliationRouteProps = RouteComponentProps<{
  affiliation: string;
}>;

interface IAffiliationViewValidatorProps extends AffiliationRouteProps {
  user: string;
  affiliation?: string;
  affiliations: string[];
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

  public componentDidUpdate() {
    this.validateAndSetAffiliation();
  }

  public componentDidMount() {
    this.validateAndSetAffiliation();
  }

  public render() {
    const { affiliation, affiliations, match, user } = this.props;

    if (affiliations.length === 0) {
      return false;
    }

    if (match.params.affiliation === '_') {
      return <AffiliationSelector user={user} affiliations={affiliations} />;
    }

    if (!affiliation) {
      return <p>{affiliation} er ikke en gyldig affiliation.</p>;
    }

    return (
      <AffiliationViewControllerWithApi
        affiliation={affiliation}
        matchPath={match.path}
        matchUrl={match.url}
        history={this.props.history}
      />
    );
  }
}

export default AffiliationViewValidator;
