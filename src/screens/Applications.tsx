import Grid from 'aurora-frontend-react-komponenter/Grid';
import { default as gql } from 'graphql-tag';
import * as React from 'react';
import { Query, QueryResult } from 'react-apollo';

import './applications/style.css';

interface IApplicationsProps {
  affiliation?: string;
}

export default class Applications extends React.Component<IApplicationsProps> {
  public render() {
    if (!this.props.affiliation) {
      return <p>Please select affiliation</p>;
    }
    const variables = {
      affiliations: [this.props.affiliation]
    };
    return (
      <Grid className="Applications-main-grid">
        <Grid.Row>
          <Grid.Col lg={12}>
            <div className="applications">
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
                    <ApplicationNode
                      key={createUniqueAppId(edge)}
                      edge={edge}
                    />
                  ));
                }}
              </Query>
            </div>
          </Grid.Col>
        </Grid.Row>
      </Grid>
    );
  }
}

const ApplicationNode = ({ edge: { node } }: { edge: IApplicationEdge }) => (
  <div>
    <p>{node.name}</p>
    <p>{node.namespace.name}</p>
    <p>{node.version.deployTag}</p>
  </div>
);

function createUniqueAppId({ node }: IApplicationEdge): string {
  return node.namespace.name + '::' + node.name;
}

function sortApplications(e1: IApplicationEdge, e2: IApplicationEdge): number {
  return createUniqueAppId(e1).localeCompare(createUniqueAppId(e2));
}

const APPLICATIONS_QUERY = gql`
  query applications($affiliations: [String!]) {
    applications(affiliations: $affiliations) {
      edges {
        node {
          affiliation {
            name
          }
          name
          namespace {
            name
          }
          status {
            code
          }
          version {
            auroraVersion
            deployTag
          }
        }
      }
    }
  }
`;

interface IApplications {
  applications: {
    edges: IApplicationEdge[];
  };
}

interface IApplicationEdge {
  node: {
    affiliation: {
      name: string;
    };
    name: string;
    namespace: {
      name: string;
    };
    status: {
      code: string;
    };
    version: {
      auroraVersion: string;
      deployTag: string;
    };
  };
}
