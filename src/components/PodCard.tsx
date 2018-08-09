import * as React from 'react';
import { IPodResource } from 'services/auroraApiClient/queries';
import styled from 'styled-components';

interface IPodCardProps {
  pod: IPodResource;
  className?: string;
}

const PodCard = ({ pod, className }: IPodCardProps) => (
  <div className={className}>
    <p>Name: {pod.name}</p>
    <p>Ready: {pod.ready ? 'Yes' : 'No'}</p>
    <p>Restart: {pod.restartCount}</p>
    <p>StartTime: {pod.startTime}</p>
    <p>Status: {pod.status}</p>
  </div>
);

export default styled(PodCard)`
  border: 1px solid black;

  p {
    margin: 0;
    padding: 5px;
  }
`;
