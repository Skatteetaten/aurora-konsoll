import * as React from 'react';
import styled from 'styled-components';
import { ImageTagType } from 'web/models/ImageTagType';
import { IVersionTableProps, VersionTableState } from './VersionTable.state';
import DeployButton from '../../components/DeployButton';
import { VersionInfo } from '../../components/VersionInfo';
import DateWithTooltip from 'web/components/DateWithTooltip';
import { Table } from '@skatteetaten/frontend-components/Table';

const columns = [
  {
    fieldName: 'type',
    key: 'type',
    name: 'Versjontype',
  },
  {
    fieldName: 'name',
    key: 'name',
    name: 'Navn',
  },
  {
    fieldName: 'lastModified',
    key: 'lastModified',
    name: 'Sist endret',
  },
  {
    fieldName: 'deploy',
    key: 'deploy',
    name: '',
  },
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
  versionBeingDeployed,
  onConfirmDeploy,
  configuredVersionTag,
  releaseTo,
  gitReference,
  isBranchDeleted,
}: Props) => {
  const versionToFilter: string =
    releaseTo && configuredVersionTag
      ? configuredVersionTag.name
      : currentVersion.name;

  const data = imageTagsConnection
    .getVersions()
    .filter((it) => it.name !== versionToFilter)
    .map((it) => {
      return {
        type: getOptionName(it.type),
        name: it.name,
        lastModified: it.image ? (
          <DateWithTooltip date={it.image.buildTime} position="left" />
        ) : (
          ''
        ),
        deploy: (
          <DeployButton
            isLoading={versionBeingDeployed === it.name}
            disabled={versionBeingDeployed !== undefined}
            buttonText="Deploy"
            dialogTitle="Vil du endre versjonen?"
            hasAccessToDeploy={hasAccessToDeploy}
            isOldVersion={!it.image}
            onConfirmDeploy={(refName?: string) =>
              onConfirmDeploy(it.name, refName)
            }
            releaseTo={releaseTo}
            currentVersion={currentVersion}
            gitReference={gitReference}
            isBranchDeleted={isBranchDeleted}
          >
            <VersionInfo>
              <p>Fra:</p>{' '}
              {!releaseTo ? currentVersion.name : configuredVersionTag?.name}
            </VersionInfo>
            <VersionInfo>
              <p>Til:</p> {it.name}
            </VersionInfo>
          </DeployButton>
        ),
      };
    });

  return (
    <TableWrapper>
      <Table
        data={data as any}
        columns={columns}
        caption={''}
        hideCaption={true}
      />
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

  div.cellContentLarge {
    padding: 6px 12px;
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
