import Grid from 'aurora-frontend-react-komponenter/Grid';
import Spinner from 'aurora-frontend-react-komponenter/Spinner';
import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';

import { IApplicationResult } from 'services/AuroraApiClient';

import { IAuroraApiComponentProps } from 'components/AuroraApi';
import { withAuroraApi } from 'components/AuroraApi';
import MatrixRoute from './routes/MatrixRoute';

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
    const { applications, loading, selectedApplications } = this.state;
    const { affiliation } = this.props;

    if (!affiliation) {
      return <p>Velg en tilhørighet</p>;
    }

    if (loading) {
      return (
        <Loading>
          <Spinner size={Spinner.Size.large} />
          <p>Laster applikasjoner for {affiliation}</p>
        </Loading>
      );
    }

    return (
      <Grid>
        <Grid.Row>
          <Grid.Col lg={12}>
            <MatrixRoute
              affiliation={affiliation}
              applications={applications}
              selectedApplications={selectedApplications}
              handleSelectedApplications={this.handleSelectedApplications}
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
