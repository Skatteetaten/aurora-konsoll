import ActionButton from 'aurora-frontend-react-komponenter/ActionButton';
import Grid from 'aurora-frontend-react-komponenter/Grid';
import Spinner from 'aurora-frontend-react-komponenter/Spinner';
import * as React from 'react';
import { Route, RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';

import { IApplicationResult } from 'services/AuroraApiClient';

import { IAuroraApiComponentProps } from 'components/AuroraApi';
import withAuroraApi from 'components/auroraApi/withAuroraApi';
import MatrixRoute from './applications/MatrixRoute';

interface IApplicationsProps
  extends RouteComponentProps<{}>,
    IAuroraApiComponentProps {
  affiliation?: string;
}

interface IApplicationsState {
  applications: IApplicationResult[];
  loading: boolean;
  selectedApplications: IApplicationResult[];
}

class Applications extends React.Component<
  IApplicationsProps,
  IApplicationsState
> {
  public state: IApplicationsState = {
    applications: [],
    loading: false,
    selectedApplications: []
  };

  public handleSelectedApplications = (apps: IApplicationResult[]) => {
    this.setState(() => ({
      selectedApplications: apps
    }));
  };

  public renderDetails = (
    props: RouteComponentProps<{
      affiliation: string;
      environment: string;
      application: string;
    }>
  ) => {
    const { affiliation, application, environment } = props.match.params;
    const found = this.state.applications.find(
      app => app.environment === environment && app.name === application
    );

    if (!found) {
      return (
        <p>
          Could not find application {environment}/{application}
        </p>
      );
    }

    const back = () =>
      this.props.history.push({
        pathname: `/app/${affiliation}`
      });

    return (
      <div>
        <ActionButton icon="Back" onClick={back}>
          Applications
        </ActionButton>
        <h1>
          {found.environment}/{found.name}
        </h1>
        <p>{found.version.auroraVersion}</p>
      </div>
    );
  };

  public fetchApplications = async (affiliation: string) => {
    this.setState(() => ({
      loading: true
    }));

    const applications = await this.props.clients.apiClient.findAllApplicationsForAffiliations(
      [affiliation]
    );

    this.setState(() => ({
      applications,
      loading: false
    }));
  };

  public componentDidMount() {
    const { affiliation } = this.props;
    if (affiliation) {
      this.fetchApplications(affiliation);
    }
  }

  public componentDidUpdate(prevProps: IApplicationsProps) {
    const { affiliation } = this.props;
    if (affiliation && affiliation !== prevProps.affiliation) {
      this.fetchApplications(affiliation);
    }
  }

  public render() {
    if (this.state.loading) {
      return (
        <Loading>
          <Spinner size={Spinner.Size.large} />
          <p>Laster applikasjoner</p>
        </Loading>
      );
    }

    const { applications, selectedApplications } = this.state;

    if (!this.props.affiliation) {
      return <p>Velg en tilhørighet</p>;
    }

    return (
      <Grid>
        <Grid.Row>
          <Grid.Col lg={12}>
            <MatrixRoute
              affiliation={this.props.affiliation}
              applications={applications}
              selectedApplications={selectedApplications}
              handleSelectedApplications={this.handleSelectedApplications}
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

export default withAuroraApi(Applications);
