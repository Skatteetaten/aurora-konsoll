import * as React from 'react';
import { IApplicationDeployment } from 'services/AuroraApiClient/types';
import Status from './Status';

export interface IApplicationMap {
  [name: string]: IApplicationDeployment[];
}

interface IRowProps {
  name: string;
  environments: string[];
  apps: IApplicationMap;
  linkBuilder: (deployment: IApplicationDeployment) => React.ComponentType;
}

const Row = ({ name, environments, apps, linkBuilder }: IRowProps) => {
  const cells = environments.map((environment, index) => {
    const key = `${environment}::${name}`;

    if (index === 0) {
      return <td key={key}>{name}</td>;
    }

    const deployment = apps[name].find(app => app.environment === environment);

    if (!deployment) {
      return <td key={key}>-</td>;
    }

    const Link = linkBuilder(deployment);
    return (
      <Status key={key} name={deployment.statusCode.toLowerCase()}>
        <Link>{deployment.version.deployTag}</Link>
      </Status>
    );
  });

  return <tr>{cells}</tr>;
};

export default Row;
