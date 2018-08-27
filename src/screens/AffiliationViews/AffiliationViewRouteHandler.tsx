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

const AffiliationViewRouteHandler = ({
  affiliation,
  affiliations,
  onAffiliationValidated,
  match
}: IAffiliationViewValidatorProps) => {
  const pathAffiliation = match.params.affiliation;

  if (pathAffiliation === '_') {
    return <p>Velg affiliation</p>;
  }

  const currentAffiliation = affiliations.find(a => a === pathAffiliation);

  if (!currentAffiliation) {
    return <p>Not valid</p>;
  }

  if (affiliation !== currentAffiliation) {
    onAffiliationValidated(currentAffiliation);
  }

  return (
    <AffiliationViewControllerWithApi
      affiliation={currentAffiliation}
      matchPath={match.path}
      matchUrl={match.url}
    />
  );
};

export default AffiliationViewRouteHandler;
