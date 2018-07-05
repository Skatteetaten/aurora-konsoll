import Grid from 'aurora-frontend-react-komponenter/Grid';
import Spinner from 'aurora-frontend-react-komponenter/Spinner';
import * as React from 'react';
import { Route, RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';

import { IApplicationResult } from 'services/AuroraApiClient';

import Filter from './applications/Filter';
import Matrix from './applications/Matrix';

interface IApplicationsProps
  extends RouteComponentProps<{ affiliation: string }> {
  affiliation: string;
  applications: IApplicationResult[];
  loading: boolean;
}

interface IApplicationsState {
  applications: IApplicationResult[];
}

export default class Applications extends React.Component<
  IApplicationsProps,
  IApplicationsState
> {
  public state: IApplicationsState = {
    applications: []
  };

  public handleSelectedApplications = (apps: IApplicationResult[]) => {
    this.setState(() => ({
      applications: apps
    }));
  };

  public renderMatrix = () => {
    const onSelectApplication = (app: IApplicationResult) => {
      this.props.history.push({
        pathname:
          this.props.location.pathname +
          `/details/${app.environment}/${app.name}`
      });
    };

    const { affiliation, applications } = this.props;
    return (
      <>
        <Filter
          applications={applications}
          handleSelectedApplications={this.handleSelectedApplications}
        />
        <h2>Applikasjoner for {affiliation}</h2>
        <Matrix
          applications={this.state.applications}
          onSelectApplication={onSelectApplication}
        />
      </>
    );
  };

  public renderDetails = (
    props: RouteComponentProps<{
      affiliation: string;
      environment: string;
      application: string;
    }>
  ) => {
    const { application, environment } = props.match.params;
    const found = this.props.applications.find(
      app => app.environment === environment && app.name === application
    );

    if (!found) {
      return (
        <p>
          Could not find application {environment}/{application}
        </p>
      );
    }

    return (
      <div>
        <h1>
          {found.environment}/{found.name}
        </h1>
        <p>{found.version.auroraVersion}</p>
      </div>
    );
  };

  public render() {
    if (this.props.loading) {
      return (
        <Loading>
          <Spinner size={Spinner.Size.large} />
          <p>Laster applikasjoner</p>
        </Loading>
      );
    }

    return (
      <Grid>
        <Grid.Row>
          <Grid.Col lg={12}>
            <Route
              exact={true}
              path="/app/:affiliation"
              render={this.renderMatrix}
            />
            <Route
              exact={true}
              path="/app/:affiliation/details/:environment/:application"
              render={this.renderDetails}
            />
          </Grid.Col>
        </Grid.Row>
      </Grid>
    );
  }
}

const Loading = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  p {
    text-align: center;
  }
`;
