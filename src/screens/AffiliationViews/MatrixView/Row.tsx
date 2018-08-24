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
}

const Row = ({ name, environments, apps }: IRowProps) => {
  const cells = environments.map((environment, index) => {
    const key = `${environment}::${name}`;

    if (index === 0) {
      return <td key={key}>{name}</td>;
    }

    const found = apps[name].find(app => app.environment === environment);

    return found ? (
      <Status
        key={key}
        name={found.statusCode.toLowerCase()}
        title={found.version.deployTag}
      >
        {found.version.deployTag}
      </Status>
    ) : (
      <td key={key}>-</td>
    );
  });

  return <tr>{cells}</tr>;
};

export default Row;
