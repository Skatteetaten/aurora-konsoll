import * as React from 'react';

import { IApplicationResult } from 'services/AuroraApiClient';
import MatrixRow, { IApplicationMap } from './matrix/MatrixRow';
import MatrixWrapper from './matrix/MatrixWrapper';

interface IMatrixProps {
  applications: IApplicationResult[];
  onSelectApplication: (app: IApplicationResult) => void;
}

const Matrix = ({ applications, onSelectApplication }: IMatrixProps) => {
  const environments = applications.reduce(
    (acc, app) => {
      if (acc.indexOf(app.environment) === -1) {
        return acc.concat(app.environment);
      }
      return acc;
    },
    [' ']
  );

  const apps: IApplicationMap = applications.reduce((acc, app) => {
    if (acc[app.name]) {
      acc[app.name].push(app);
    } else {
      acc[app.name] = [app];
    }
    return acc;
  }, {});

  return (
    <MatrixWrapper>
      <table>
        <thead>
          <tr>{environments.sort().map(name => <th key={name}>{name}</th>)}</tr>
        </thead>
        <tbody>
          {Object.keys(apps)
            .sort()
            .map(name => (
              <MatrixRow
                key={name}
                name={name}
                environments={environments}
                apps={apps}
                onSelectApplication={onSelectApplication}
              />
            ))}
        </tbody>
      </table>
    </MatrixWrapper>
  );
};

export default Matrix;
