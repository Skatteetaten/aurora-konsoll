import * as React from 'react';
import { IApplication } from 'services/AuroraApiClient/types';
import Status from './Status';

export interface IApplicationMap {
  [name: string]: IApplication[];
}

interface IRowProps {
  name: string;
  environments: string[];
  apps: IApplicationMap;
  onSelectApplication: (app: IApplication) => void;
}

const Row = ({ name, environments, apps, onSelectApplication }: IRowProps) => {
  const handleSelectApplication = (found: IApplication) => () =>
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
