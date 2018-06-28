import * as React from 'react';
import { IApplicationResult } from 'services/AuroraApiClient';

interface IApplicationNodeProps {
  app: IApplicationResult;
}

const Card = ({ app }: IApplicationNodeProps) => (
  <div title={app.version.deployTag}>
    <p>{app.name}</p>
    <p>{app.namespace}</p>
    <p>{app.version.deployTag}</p>
  </div>
);

export default Card;
