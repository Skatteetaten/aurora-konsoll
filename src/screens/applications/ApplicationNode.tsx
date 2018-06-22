import * as React from 'react';
import { IApplicationEdge } from './Applications.graphql';

interface IApplicationNodeProps {
  edge: IApplicationEdge;
}

const ApplicationNode = ({ edge: { node } }: IApplicationNodeProps) => (
  <div>
    <p>{node.name}</p>
    <p>{node.namespace.name}</p>
    <p>{node.version.deployTag}</p>
  </div>
);

export default ApplicationNode;
