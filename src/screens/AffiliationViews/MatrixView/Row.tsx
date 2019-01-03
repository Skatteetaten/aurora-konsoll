import { IApplicationDeployment } from 'models/ApplicationDeployment';
import * as React from 'react';
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
      return (
        <td key={key} title={name}>
          {name}
        </td>
      );
    }

    const deployment = apps[name].find(app => app.environment === environment);
    if (!deployment) {
      return <td key={key}>-</td>;
    }

    const tooltip = deployment.version.releaseTo
      ? `ReleaseTo: ${deployment.version.releaseTo}`
      : deployment.version.deployTag.name;

    const releaseToHint = deployment.version.releaseTo ? '*' : '';

    const Link = linkBuilder(deployment);
    return (
      <Status key={key} code={deployment.status.code} title={tooltip}>
        <Link>{`${releaseToHint}${deployment.version.deployTag.name}`}</Link>
      </Status>
    );
  });

  return <tr>{cells}</tr>;
};

export default Row;
