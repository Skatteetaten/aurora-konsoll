import * as React from 'react';
import Table from 'aurora-frontend-react-komponenter/Table';
import styled from 'styled-components';
import { ImageTagType } from 'models/ImageTagType';
import { IVersionTableProps, VersionTableState } from './VersionTable.state';
import { useEffect } from 'react';
import { DeployButton } from '../../components/DeployButton';
import { VersionInfo } from '../../components/VersionInfo';

const columns = [
  {
    fieldName: 'type',
    key: 'type',
    name: 'Versjontype'
  },
  {
    fieldName: 'name',
    key: 'name',
    name: 'Navn'
  },
  {
    fieldName: 'lastModified',
    key: 'lastModified',
    name: 'Sist endret'
  },
  {
    fieldName: 'deploy',
    key: 'deploy',
    name: ''
  }
];

function getOptionName(type: ImageTagType): string {
  switch (type) {
    case ImageTagType.AURORA_VERSION:
      return 'Aurora Version';
    case ImageTagType.AURORA_SNAPSHOT_VERSION:
      return 'Unik snapshot version';
    case ImageTagType.BUGFIX:
      return 'Bugfix';
    case ImageTagType.LATEST:
      return 'Latest';
    case ImageTagType.MAJOR:
      return 'Major';
    case ImageTagType.MINOR:
      return 'Minor';
    case ImageTagType.SNAPSHOT:
      return 'Snapshot';
    case ImageTagType.COMMIT_HASH:
      return 'Commit hash';
    default:
      return '';
  }
}

type Props = IVersionTableProps & VersionTableState;

export const VersionTable = ({
  currentVersion,
  imageTagsConnection,
  hasAccessToDeploy,
  fetchVersions,
  isFetching,
  repository,
  searchText,
  versionType,
  versionBeingDeployed,
  onConfirmDeploy
}: Props) => {
  const index = imageTagsConnection.findVersionIndex(currentVersion.name);
  const hasVersions = imageTagsConnection.totalVersionsCount() > 0;

  useEffect(() => {
    // If configured version is not in the list, fetch more to find the version.
    if (
      hasVersions &&
      index === -1 &&
      !isFetching &&
      versionType === currentVersion.type
    ) {
      fetchVersions(repository, versionType, 100, true, searchText);
    }
  }, [
    hasVersions,
    currentVersion.type,
    fetchVersions,
    index,
    isFetching,
    repository,
    searchText,
    versionType
  ]);

  const data = imageTagsConnection
    .getVersions()
    .filter(it => it.name !== currentVersion.name)
    .map(it => {
      return {
        type: getOptionName(it.type),
        name: it.name,
        lastModified: it.image ? it.image.buildTime : '',
        deploy: (
          <DeployButton
            isLoading={versionBeingDeployed === it.name}
            buttonText="Deploy"
            dialogTitle="Vil du endre versjonen?"
            hasAccessToDeploy={hasAccessToDeploy}
            isOldVersion={!it.image}
            onConfirmDeploy={() => onConfirmDeploy(it.name)}
          >
            <VersionInfo>
              <p>Fra:</p> {currentVersion.name}
            </VersionInfo>
            <VersionInfo>
              <p>Til:</p> {it.name}
            </VersionInfo>
          </DeployButton>
        )
      };
    });

  return (
    <TableWrapper>
      <Table data={data} columns={columns} />
    </TableWrapper>
  );
};

const TableWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-x: hidden;
  table {
    background-color: white;
    width: 100%;
    th:nth-child(1) {
      width: 15%;
    }
    th:nth-child(2) {
      width: 65%;
    }
    th:nth-child(3) {
      width: 20%;
    }
  }

  tbody {
    tr {
      &:hover,
      &:active,
      &:focus {
        background: #cde1f9 !important;
        button {
          opacity: 1;
        }
      }
    }
  }

  td button {
    opacity: 0;
    transition: none !important;
  }

  button.ms-Button.ms-Button--action.ms-Button--command {
    height: 100%;
  }

  .ms-List-cell {
    cursor: pointer;
  }
`;
