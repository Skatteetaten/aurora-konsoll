import Grid from 'aurora-frontend-react-komponenter/Grid';
import * as React from 'react';

import { AuroraApi, IApiClients } from 'components/AuroraApi';
import { IApplicationResult } from 'services/AuroraApiClient';
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
              {(applications, loading) => {
                if (loading) {
                  return <p>Loading</p>;
                }
                return (
                  <Matrix
                    applications={applications}
                    onSelectApplication={onSelectApplication}
                  />
                );
              }}
            </AuroraApi>
          </Grid.Col>
        </Grid.Row>
      </Grid>
    );
  }
}
