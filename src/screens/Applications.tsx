import Dropdown from 'aurora-frontend-react-komponenter/Dropdown';
import Grid from 'aurora-frontend-react-komponenter/Grid';
import { default as gql } from 'graphql-tag';
import * as React from 'react';

import GoboQuery from 'modules/GoboQuery';

import './applications/style.css';

class Applications extends React.Component {
  public render() {
    return (
      <Grid className="Applications-main-grid">
        <Grid.Row>
          <Grid.Col lg={2}>
            <GoboQuery query={AFFILIATION_QUERY}>
              {(data: IAffiliations) => (
                <Dropdown options={toDropdownOptions(data)} />
              )}
            </GoboQuery>
          </Grid.Col>
        </Grid.Row>
      </Grid>
    );
  }
}

function toDropdownOptions(data: IAffiliations): IDropdownOption[] {
  return data.affiliations.edges
    .reduce(
      (acc: IDropdownOption[], edge) => [
        ...acc,
        {
          key: edge.node.name.toLowerCase(),
          text: edge.node.name.toLowerCase()
        }
      ],
      []
    )
    .sort((o1, o2) => {
      return o1.text.localeCompare(o2.text);
    });
}

const AFFILIATION_QUERY = gql`
  {
    affiliations {
      edges {
        node {
          name
        }
      }
    }
  }
`;

interface IAffiliations {
  affiliations: {
    edges: Array<{
      node: {
        name: string;
      };
    }>;
  };
}

interface IDropdownOption {
  key: string;
  text: string;
}

export default Applications;
