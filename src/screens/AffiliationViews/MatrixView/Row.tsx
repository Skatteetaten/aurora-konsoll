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
  showSemanticVersion: boolean;
}

const Row = ({
  name,
  environments,
  apps,
  linkBuilder,
  showSemanticVersion: showExactVersion
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

    const isReleaseTo = !!deployment.version.releaseTo;
    const tooltip = isReleaseTo
      ? `ReleaseTo: ${deployment.version.releaseTo}`
      : deployment.version.deployTag.name;

    const releaseToHint = deployment.version.releaseTo ? '*' : '';

    const Link = linkBuilder(deployment);
    const deployTag = deployment.version.deployTag.name;
    const semanticVersion =
      showExactVersion && getExactVersion(deployment.version.auroraVersion);

    const isSameVersion =
      semanticVersion && deployTag.localeCompare(semanticVersion) === 0;
    return (
      <Status key={key} code={deployment.status.code} title={tooltip}>
        <Link>
          <span>
            {`${releaseToHint}${deployTag}`}
            {!isSameVersion && (
              <>
                <br />
                {semanticVersion}
              </>
            )}
          </span>
        </Link>
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
