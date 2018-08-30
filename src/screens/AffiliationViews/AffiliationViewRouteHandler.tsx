import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { AffiliationViewControllerWithApi } from './AffiliationViewController';

export type AffiliationRouteProps = RouteComponentProps<{
  affiliation: string;
}>;

interface IAffiliationViewValidatorProps extends AffiliationRouteProps {
  affiliation?: string;
  affiliations: string[];
  onAffiliationValidated: (affiliation: string) => void;
}

class AffiliationViewRouteHandler extends React.Component<
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
    const { affiliation, affiliations, match } = this.props;

    if (affiliations.length === 0) {
      return false;
    }

    if (match.params.affiliation === '_') {
      return <p>Velg affiliation</p>;
    }

    if (!affiliation) {
      return <p>Not valid</p>;
    }

    return (
      <AffiliationViewControllerWithApi
        affiliation={affiliation}
        matchPath={match.path}
        matchUrl={match.url}
      />
    );
  }
}

export default AffiliationViewRouteHandler;
