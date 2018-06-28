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
    if (index === 0) {
      return <td key={index}>{name}</td>;
    }

    const found = apps[name].find(app => app.namespace === namespace);

    if (found) {
      return (
        <Status
          key={index}
          name={found.statusCode.toLowerCase()}
          onClick={handleSelectApplication(found)}
          title={found.version.deployTag}
        >
          {found.version.deployTag || found.version.auroraVersion}
        </Status>
      );
    } else {
      return <td key={index}>-</td>;
    }
  });
  return <tr>{cells}</tr>;
};

export default MatrixRow;
