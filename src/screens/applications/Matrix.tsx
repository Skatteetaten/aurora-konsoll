import * as React from 'react';
import { default as styled } from 'styled-components';

import { IApplicationResult } from 'services/AuroraApiClient';
import MatrixRow, { IApplicationMap } from './matrix/MatrixRow';

interface IMatrixProps {
  applications: IApplicationResult[];
  onSelectApplication: (app: IApplicationResult) => void;
}

const Matrix = ({ applications, onSelectApplication }: IMatrixProps) => {
  const namespaces = applications.reduce(
    (acc, app) => {
      if (acc.indexOf(app.namespace) === -1) {
        return acc.concat(app.namespace);
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
          <tr>{namespaces.sort().map(name => <th key={name}>{name}</th>)}</tr>
        </thead>
        <tbody>
          {Object.keys(apps)
            .sort()
            .map(name => (
              <MatrixRow
                key={name}
                name={name}
                namespaces={namespaces}
                apps={apps}
                onSelectApplication={onSelectApplication}
              />
            ))}
        </tbody>
      </table>
    </MatrixWrapper>
  );
};

const MatrixWrapper = styled.div`
  position: relative;
  font-size: 14px;

  table {
    border-spacing: 0;
    border-collapse: collapse;
    table-layout: fixed;
  }

  tbody {
    td {
      &:first-child {
        max-width: 210px;
      }
      max-width: 130px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  th,
  td {
    @extend table;
    padding: 15px 50px 15px 15px;
    text-align: left;
    border-bottom: 1px solid #ddd;
    border-top: 1px solid #ddd;
    white-space: nowrap;
  }
`;

export default Matrix;
