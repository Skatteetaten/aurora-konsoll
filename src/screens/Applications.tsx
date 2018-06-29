import Grid from 'aurora-frontend-react-komponenter/Grid';
import Spinner from 'aurora-frontend-react-komponenter/Spinner';
import * as React from 'react';
import styled from 'styled-components';

import { IApplicationResult } from 'services/AuroraApiClient';

import Filter from './applications/Filter';
import Matrix from './applications/Matrix';

interface IApplicationsProps {
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
    this.setState(state => ({
      applications: apps
    }));
  };

  public render() {
    const onSelectApplication = (app: IApplicationResult) => {
      // tslint:disable-next-line:no-console
      console.log(app);
    };

    const { affiliation, applications, loading } = this.props;

    if (loading) {
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
            <Filter
              applications={applications}
              handleSelectedApplications={this.handleSelectedApplications}
            />
            <h2>Applikasjoner for {affiliation}</h2>
            <Matrix
              applications={this.state.applications}
              onSelectApplication={onSelectApplication}
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
