import Grid from 'aurora-frontend-react-komponenter/Grid';
import * as React from 'react';
import { Query, QueryResult } from 'react-apollo';
import { default as styled } from 'styled-components';

import ApplicationNode from './applications/ApplicationNode';
import {
  APPLICATIONS_QUERY,
  IApplicationEdge,
  IApplications
} from './applications/Applications.graphql';

interface IApplicationsProps {
  affiliation?: string;
}

const Applications = ({ affiliation }: IApplicationsProps) => {
  if (!affiliation) {
    return <p>Please select affiliation</p>;
  }
  const variables = {
    affiliations: [affiliation]
  };

  const createUniqueAppId = ({ node }: IApplicationEdge) =>
    node.namespace.name + '::' + node.name;

  const sortApplications = (e1: IApplicationEdge, e2: IApplicationEdge) =>
    createUniqueAppId(e1).localeCompare(createUniqueAppId(e2));

  return (
    <FlexGrid>
      <Grid.Row>
        <Grid.Col lg={12}>
          <ApplicationWrapper>
            <Query query={APPLICATIONS_QUERY} variables={variables}>
              {({ loading, data }: QueryResult<IApplications>) => {
                if (!data || !data.applications) {
                  return false;
                }
                if (loading) {
                  return <h2>Loading...</h2>;
                }

                const edges = [...data.applications.edges].sort(
                  sortApplications
                );

                return edges.map(edge => (
                  <ApplicationNode key={createUniqueAppId(edge)} edge={edge} />
                ));
              }}
            </Query>
          </ApplicationWrapper>
        </Grid.Col>
      </Grid.Row>
    </FlexGrid>
  );
};

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

export default Applications;
