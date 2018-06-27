import Grid from 'aurora-frontend-react-komponenter/Grid';
import * as React from 'react';
import { default as styled } from 'styled-components';

import { IApplicationEdge } from './applications/Applications.graphql';
import Card from './applications/Card';

interface IApplicationsProps {
  edges?: IApplicationEdge[];
}

export default class Applications extends React.Component<IApplicationsProps> {
  public static defaultProps: IApplicationsProps = {
    edges: []
  };

  public render() {
    const { edges } = this.props;
    if (!edges) {
      return null;
    }

    const createUniqueAppId = ({ node }: IApplicationEdge) =>
      node.namespace.name + '::' + node.name;

    const sortApplications = (e1: IApplicationEdge, e2: IApplicationEdge) =>
      createUniqueAppId(e1).localeCompare(createUniqueAppId(e2));

    return (
      <FlexGrid>
        <Grid.Row>
          <Grid.Col lg={12}>
            <ApplicationWrapper>
              {Array.from(edges)
                .sort(sortApplications)
                .map(edge => (
                  <Card key={createUniqueAppId(edge)} edge={edge} />
                ))}
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
