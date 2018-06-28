import Grid from 'aurora-frontend-react-komponenter/Grid';
import Spinner from 'aurora-frontend-react-komponenter/Spinner';
import * as React from 'react';

import { AuroraApi, IApiClients } from 'components/AuroraApi';
import { IApplicationResult } from 'services/AuroraApiClient';
import styled from 'styled-components';
import Matrix from './applications/Matrix';

export default class Applications extends React.Component<{
  affiliation?: string;
}> {
  public render() {
    const { affiliation } = this.props;

    if (!affiliation) {
      return <p>Please select affiliation</p>;
    }

    const fetchApplications = ({ apiClient }: IApiClients) =>
      apiClient.findAllApplicationsForAffiliations([affiliation]);

    const onSelectApplication = (app: IApplicationResult) => {
      // tslint:disable-next-line:no-console
      console.log(app);
    };

    return (
      <Grid>
        <Grid.Row>
          <Grid.Col lg={12}>
            <AuroraApi fetch={fetchApplications}>
              {(applications = [], loading) => {
                if (loading || !applications) {
                  return (
                    <Loading>
                      <Spinner size={Spinner.Size.large} />
                      <p>Laster applikasjoner</p>
                    </Loading>
                  );
                }
                return (
                  <>
                    <h2>Applikasjoner for {affiliation}</h2>
                    <Matrix
                      applications={applications}
                      onSelectApplication={onSelectApplication}
                    />
                  </>
                );
              }}
            </AuroraApi>
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
