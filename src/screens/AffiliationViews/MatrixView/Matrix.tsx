import * as React from 'react';
import styled from 'styled-components';
import { IApplicationDeploymentContext } from '../ApplicationDeploymentContext';
import Row, { IApplicationMap } from './Row';

interface IMatrixProps {
  className?: string;
  showSemanticVersion: boolean;
  expandApplicationName: boolean;
}

const Matrix = ({
  deployments,
  buildDeploymentLink,
  className,
  showSemanticVersion: showExactVersion
}: IApplicationDeploymentContext & IMatrixProps) => {
  const environments = deployments.reduce(
    (acc, app) => {
      if (acc.indexOf(app.environment) === -1) {
        return acc.concat(app.environment);
      }
      return acc;
    },
    [' ']
  );

  const apps: IApplicationMap = deployments.reduce((acc, app) => {
    if (acc[app.name]) {
      acc[app.name].push(app);
    } else {
      acc[app.name] = [app];
    }
    return acc;
  }, {});

  return (
    <div className={className}>
      <table>
        <thead>
          <tr>
            {environments.sort().map(name => (
              <th key={name}>{name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.keys(apps)
            .sort()
            .map(name => (
              <Row
                key={name}
                showSemanticVersion={showExactVersion}
                name={name}
                environments={environments}
                apps={apps}
                linkBuilder={buildDeploymentLink}
              />
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default styled(Matrix)`
  flex: 1;
  position: relative;
  overflow: auto;

  table {
    font-size: 14px;
    border-spacing: 0;
    table-layout: fixed;
  }

  thead tr:nth-child(1) th {
    background: white;
    position: sticky;
    top: 0;
    z-index: 10;
  }

  tbody {
    td {
      &:first-child {
        position: sticky;
        left: 0;
        background: white;
        z-index: 9;
        padding: 15px 50px 15px 15px;
        overflow: hidden;
        text-overflow: ellipsis;
        cursor: default;
        ${props =>
          props.expandApplicationName &&
          `max-width: 100%; white-space: nowrap;`}
      }
      max-width: 150px;
    }
  }

  th,
  td {
    @extend table;
    text-align: left;
    white-space: nowrap;
    border-top: 1px solid #ddd;
    border-right: 2px solid white;
  }

  th {
    padding: 15px 50px 15px 15px;
  }
`;
