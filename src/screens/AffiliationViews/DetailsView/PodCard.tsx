import Grid from 'aurora-frontend-react-komponenter/Grid';
import * as React from 'react';
import { IPodResource } from 'services/AuroraApiClient/queries/applications-query';
import styled from 'styled-components';

interface IPodCardProps {
  pod: IPodResource;
  className?: string;
}

const PodCard = ({ pod, className }: IPodCardProps) => (
  <Grid>
    <Grid.Row>
      <div className={className}>
        <Grid.Col lg={1}>
          <p>Name:</p>
          <p>Ready:</p>
          <p>Restart:</p>
          <p>StartTime:</p>
          <p>Status:</p>
        </Grid.Col>
        <Grid.Col lg={2}>
          <p>{pod.name}</p>
          <p>{pod.ready ? 'Yes' : 'No'}</p>
          <p>{pod.restartCount}</p>
          <p>{pod.startTime}</p>
          <p>{pod.status}</p>
        </Grid.Col>
      </div>
    </Grid.Row>
  </Grid>
);

export default styled(PodCard)`
  border: 1px solid black;

  p {
    margin: 0;
    padding: 5px;
  }
`;
