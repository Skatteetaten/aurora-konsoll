import * as React from 'react';

import { IApplicationInstance } from 'services/AuroraApiClient/types';
import { AffiliationRouteProps } from '../AffiliationRouteProps';
import Filter from './Filter/Filter';
import Matrix from './Matrix/Matrix';

export interface IMatrixViewProps {
  applications: IApplicationInstance[];
  selectedApplications: IApplicationInstance[];
  handleSelectedApplications: (apps: IApplicationInstance[]) => void;
}

const MatrixView = (props: IMatrixViewProps & AffiliationRouteProps) => {
  const onSelectApplication = (app: IApplicationInstance) => {
    props.history.push({
      pathname:
        props.location.pathname + `/details/${app.environment}/${app.name}`
    });
  };

  const { applications, selectedApplications } = props;
  const { affiliation } = props.match.params;
  return (
    <>
      <Filter
        applications={applications}
        handleSelectedApplications={props.handleSelectedApplications}
      />
      <h2>Applikasjoner for {affiliation}</h2>
      <Matrix
        applications={selectedApplications}
        onSelectApplication={onSelectApplication}
      />
    </>
  );
};

export default MatrixView;
