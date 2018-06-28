import * as React from 'react';

import { IApplicationResult } from 'services/AuroraApiClient';

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
      return (
        <td key={index} className="table-data-btn">
          {name}
        </td>
      );
    }

    const found = apps[name].find(app => app.namespace === namespace);

    if (found) {
      const classes = `table-button status-${found.statusCode &&
        found.statusCode.toLowerCase()}`;
      return (
        <td
          key={index}
          onClick={handleSelectApplication(found)}
          className={classes}
          style={{
            backgroundColor: 'green'
          }}
          title={found.version.deployTag}
        >
          {found.version.deployTag || found.version.auroraVersion}
        </td>
      );
    } else {
      return <td key={index}>-</td>;
    }
  });
  return <tr>{cells}</tr>;
};

export default MatrixRow;
