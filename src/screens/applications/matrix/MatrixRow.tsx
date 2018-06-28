import * as React from 'react';

import { IApplicationResult } from 'services/AuroraApiClient';
import Status from './matrixRow/Status';

export interface IApplicationMap {
  [name: string]: IApplicationResult[];
}

interface IMatrixRowProps {
  name: string;
  namespaces: string[];
  apps: IApplicationMap;
  onSelectApplication: (app: IApplicationResult) => void;
}

const MatrixRow = ({
  name,
  namespaces,
  apps,
  onSelectApplication
}: IMatrixRowProps) => {
  const handleSelectApplication = (found: IApplicationResult) => () =>
    onSelectApplication(found);

  const cells = namespaces.map((namespace, index) => {
    const key = `${namespace}::${name}`;

    if (index === 0) {
      return <td key={key}>{name}</td>;
    }

    const found = apps[name].find(app => app.namespace === namespace);

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

export default MatrixRow;
