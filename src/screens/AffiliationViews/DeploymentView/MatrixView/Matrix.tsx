import React, { useEffect } from 'react';
import styled from 'styled-components';
import Row, { IApplicationMap } from './components/Row';
import { IApplicationDeployment } from 'models/ApplicationDeployment';
import Spinner from 'components/Spinner';

interface IMatrixProps {
  showSemanticVersion: boolean;
  expandApplicationName: boolean;
  sortBySizeAndAlphabetical: boolean;
  isFetching: boolean;
  deployments: IApplicationDeployment[];
}

export const Matrix: React.FC<IMatrixProps> = ({
  deployments,
  isFetching,
  expandApplicationName,
  showSemanticVersion: showExactVersion,
  sortBySizeAndAlphabetical,
}) => {
  const [environments, setEnvironments] = React.useState<string[]>([]);

  const appCountForEnv = deployments.reduce((prev, cur) => {
    prev[cur.environment] = (prev[cur.environment] || 0) + 1;
    return prev;
  }, {});

  useEffect(() => {
    if (deployments.length > 0) {
      if (sortBySizeAndAlphabetical) {
        const envsSortedByAppCount = Object.keys(appCountForEnv).sort(
          (a, b) => appCountForEnv[b] - appCountForEnv[a] || a.localeCompare(b)
        );
        setEnvironments([' ', ...envsSortedByAppCount]);
      } else {
        setEnvironments(
          deployments.reduce(
            (acc, app) => {
              if (acc.indexOf(app.environment) === -1) {
                return acc.concat(app.environment);
              }
              return acc;
            },
            [' ']
          )
        );
      }
    }
  }, [sortBySizeAndAlphabetical, deployments]);

  if (isFetching) {
    return <Spinner />;
  }

  const apps: IApplicationMap = deployments.reduce((acc, app) => {
    if (acc[app.name]) {
      acc[app.name].push(app);
    } else {
      acc[app.name] = [app];
    }
    return acc;
  }, {});

  const renderRows = () => {
    if (sortBySizeAndAlphabetical) {
      return (
        <thead>
          <tr>
            {environments.map((name) => (
              <th key={name}>{name}</th>
            ))}
          </tr>
        </thead>
      );
    }
    return (
      <thead>
        <tr>
          {environments.sort().map((name) => (
            <th key={name}>{name}</th>
          ))}
        </tr>
      </thead>
    );
  };

  return (
    <Wrapper expandApplicationName={expandApplicationName}>
      <table>
        {renderRows()}
        <tbody>
          {Object.keys(apps)
            .sort()
            .map((name, index) => (
              <Row
                key={index}
                showSemanticVersion={showExactVersion}
                name={name}
                environments={environments}
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
