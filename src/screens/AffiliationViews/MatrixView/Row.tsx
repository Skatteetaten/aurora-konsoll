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
  showExactVersion: boolean;
}

const Row = ({
  name,
  environments,
  apps,
  linkBuilder,
  showExactVersion
}: IRowProps) => {
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
    const version =
      (showExactVersion && getExactVersion(deployment.version.auroraVersion)) ||
      deployment.version.deployTag.name;
    return (
      <Status key={key} code={deployment.status.code} title={tooltip}>
        <Link>{`${releaseToHint}${version}`}</Link>
      </Status>
    );
  });

  return <tr>{cells}</tr>;
};

function getExactVersion(auroraVersion?: string): string | undefined {
  if (!auroraVersion) {
    return;
  }

  const shortVersion = auroraVersion.split(/(^(\d+\.)(\d+\.)(\*|\d+))/);
  if (shortVersion.length > 1) {
    return shortVersion[1];
  }
  return;
}

export default Row;
