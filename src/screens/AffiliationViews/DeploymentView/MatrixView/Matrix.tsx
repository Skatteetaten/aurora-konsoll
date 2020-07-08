import * as React from 'react';
import styled from 'styled-components';
import Row, { IApplicationMap } from './components/Row';
import { IApplicationDeployment } from 'models/ApplicationDeployment';
import Spinner from 'components/Spinner';

interface IMatrixProps {
  showSemanticVersion: boolean;
  expandApplicationName: boolean;
  isFetching: boolean;
  deployments: IApplicationDeployment[];
}

export const Matrix: React.FC<IMatrixProps> = ({
  deployments,
  isFetching,
  expandApplicationName,
  showSemanticVersion: showExactVersion,
}) => {
  if (isFetching) {
    return <Spinner />;
  }

  const appCountForEnv = deployments.reduce((prev, cur) => {
    prev[cur.environment] = (prev[cur.environment] || 0) + 1;
    return prev;
  }, {});

  const environments = Object.keys(appCountForEnv)
    .sort()
    .sort((a, b) => appCountForEnv[b] - appCountForEnv[a]);

  const apps: IApplicationMap = deployments.reduce((acc, app) => {
    if (acc[app.name]) {
      acc[app.name].push(app);
    } else {
      acc[app.name] = [app];
    }
    return acc;
  }, {});

  return (
    <Wrapper expandApplicationName={expandApplicationName}>
      <table>
        <thead>
          <tr>
            <th key={' '}> </th>
            {environments.map((name) => (
              <th key={name}>{name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.keys(apps)
            .sort()
            .map((name) => (
              <Row
                key={name}
                showSemanticVersion={showExactVersion}
                name={name}
                environments={[' ', ...environments]}
                apps={apps}
              />
            ))}
        </tbody>
      </table>
    </Wrapper>
  );
};

const Wrapper = styled.div<{ expandApplicationName: boolean }>`
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
        ${(props) =>
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
