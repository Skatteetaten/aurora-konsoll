import * as React from 'react';
import { Route, RouteComponentProps } from 'react-router-dom';

import { IApplicationResult } from 'services/AuroraApiClient';
import Filter from './matrixRoute/Filter';
import Matrix from './matrixRoute/Matrix';

interface IMatrixRouteProps {
  affiliation: string;
  applications: IApplicationResult[];
  selectedApplications: IApplicationResult[];
  handleSelectedApplications: (apps: IApplicationResult[]) => void;
}

const MatrixView = (props: IMatrixRouteProps & RouteComponentProps<{}>) => {
  const onSelectApplication = (app: IApplicationResult) => {
    props.history.push({
      pathname:
        props.location.pathname + `/details/${app.environment}/${app.name}`
    });
  };

  const { affiliation, applications, selectedApplications } = props;
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

const MatrixWithRouter = (props: IMatrixRouteProps) => (
  routerProps: RouteComponentProps<{}>
) => <MatrixView {...props} {...routerProps} />;

const MatrixRoute = (props: IMatrixRouteProps) => (
  <Route
    exact={true}
    path="/app/:affiliation"
    render={MatrixWithRouter(props)}
  />
);

export default MatrixRoute;
