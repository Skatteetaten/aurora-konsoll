import * as React from 'react';

import { IApplicationResult } from 'services/AuroraApiClient';
import Status from './Status';

export interface IApplicationMap {
  [name: string]: IApplicationResult[];
}

interface IRowProps {
  name: string;
  environments: string[];
  apps: IApplicationMap;
  onSelectApplication: (app: IApplicationResult) => void;
}

const Row = ({ name, environments, apps, onSelectApplication }: IRowProps) => {
  const handleSelectApplication = (found: IApplicationResult) => () =>
    onSelectApplication(found);

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
        onClick={handleSelectApplication(found)}
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
