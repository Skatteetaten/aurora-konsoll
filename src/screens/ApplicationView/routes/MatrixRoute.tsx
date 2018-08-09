import * as React from 'react';
import { Route, RouteComponentProps } from 'react-router-dom';

import { IApplicationResult } from 'services/AuroraApiClient';
import Filter from '../Filter/index';
import Table from '../Matrix/Table';

interface IMatrixViewProps {
  affiliation: string;
  applications: IApplicationResult[];
  selectedApplications: IApplicationResult[];
  handleSelectedApplications: (apps: IApplicationResult[]) => void;
}

const MatrixView = (props: IMatrixViewProps & RouteComponentProps<{}>) => {
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
      <Table
        applications={selectedApplications}
        onSelectApplication={onSelectApplication}
      />
    </>
  );
};

const MatrixRouteWrapper = (props: IMatrixViewProps) => (
  routerProps: RouteComponentProps<{}>
) => <MatrixView {...props} {...routerProps} />;

const MatrixRoute = (props: IMatrixViewProps) => (
  <Route
    exact={true}
    path="/app/:affiliation"
    render={MatrixRouteWrapper(props)}
  />
);

export default MatrixRoute;
