import * as React from 'react';

import { IApplication } from 'services/AuroraApiClient/types';
import Row, { IApplicationMap } from './Row';
import Wrapper from './Wrapper';

interface IMatrixProps {
  applications: IApplication[];
  onSelectApplication: (app: IApplication) => void;
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
    <Wrapper>
      <table>
        <thead>
          <tr>{environments.sort().map(name => <th key={name}>{name}</th>)}</tr>
        </thead>
        <tbody>
          {Object.keys(apps)
            .sort()
            .map(name => (
              <Row
                key={name}
                name={name}
                environments={environments}
                apps={apps}
                onSelectApplication={onSelectApplication}
              />
            ))}
        </tbody>
      </table>
    </Wrapper>
  );
};

export default Matrix;
