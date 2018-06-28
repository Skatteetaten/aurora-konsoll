import Grid from 'aurora-frontend-react-komponenter/Grid';
import * as React from 'react';
import { default as styled } from 'styled-components';

import { AuroraApi, IApiClients } from 'components/AuroraApi';
import { IApplicationResult } from 'services/AuroraApiClient';
import Card from './applications/Card';

export default class Applications extends React.Component<{
  affiliation?: string;
}> {
  public render() {
    const { affiliation } = this.props;
    if (!affiliation) {
      return <p>Please select affiliation</p>;
    }
    const createUniqueAppId = (app: IApplicationResult) =>
      app.namespace + '::' + app.name;

    const sortApplications = (e1: IApplicationResult, e2: IApplicationResult) =>
      createUniqueAppId(e1).localeCompare(createUniqueAppId(e2));

    const fetchApplications = ({ apiClient }: IApiClients) =>
      apiClient.findAllApplicationsForAffiliations([affiliation]);

    return (
      <FlexGrid>
        <Grid.Row>
          <Grid.Col lg={12}>
            <ApplicationWrapper>
              <AuroraApi fetch={fetchApplications}>
                {(applications, loading) => {
                  if (loading) {
                    return <p>Loading</p>;
                  }
                  return applications
                    .sort(sortApplications)
                    .map(app => (
                      <Card key={createUniqueAppId(app)} app={app} />
                    ));
                }}
              </AuroraApi>
            </ApplicationWrapper>
          </Grid.Col>
        </Grid.Row>
      </FlexGrid>
    );
  }
}

const FlexGrid = styled(Grid)`
  flex: 1;
`;

const ApplicationWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  div {
    flex: 1;
    min-width: 300px;
    max-width: 300px;
    margin: 5px;
    padding: 3px;
    border: 1px solid black;
  }

  div p {
    margin: 0;
  }
`;
