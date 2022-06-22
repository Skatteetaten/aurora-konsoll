import * as React from 'react';
import styled from 'styled-components';
import { ImageTagType } from 'web/models/ImageTagType';
import { DeployButton } from '../../components/DeployButton';
import { VersionInfo } from '../../components/VersionInfo';
import DateWithTooltip from 'web/components/DateWithTooltip';
import { Table } from '@skatteetaten/frontend-components/Table';
import {
  IImageTag,
  IVersion,
} from '../../../../../../../services/auroraApiClients/imageRepositoryClient/query';
import { skeColor } from '@skatteetaten/frontend-components/utils';
import HighlightedValues from './HighlightedValues';
import Description from './Description';

const columns = [
  {
    fieldName: 'type',
    key: 'type',
    name: 'Versjonstype',
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
      return 'Aurora-versjon';
    case ImageTagType.AURORA_SNAPSHOT_VERSION:
      return 'Unik snapshot-versjon';
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

export interface IVersionTableProps {
  onConfirmDeploy: (version: string) => void;
  hasAccessToDeploy: boolean;
  versionType: ImageTagType;
  currentVersion: IImageTag;
  versionBeingDeployed?: string;
  configuredVersionTag?: IImageTag;
  releaseTo?: string;
  versions: IVersion[];
  searchText: string;
}

export const VersionTable = ({
  currentVersion,
  hasAccessToDeploy,
  versionBeingDeployed,
  onConfirmDeploy,
  configuredVersionTag,
  releaseTo,
  versions,
  versionType,
  searchText,
}: IVersionTableProps) => {
  const versionToFilter: string =
    releaseTo && configuredVersionTag
      ? configuredVersionTag.name
      : currentVersion.name;

  const data = versions
    .filter((it) => it.name !== versionToFilter)
    .map((it) => ({
      type: getOptionName(it.type),
      name:
        versionType === ImageTagType.SEARCH ? (
          <HighlightedValues searchText={searchText} text={it.name} />
        ) : (
          it.name
        ),
      lastModified: it.version ? (
        <DateWithTooltip date={it.version.buildTime} position="left" />
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
          onConfirmDeploy={() => onConfirmDeploy(it.name)}
          releaseTo={releaseTo}
          currentVersion={currentVersion}
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
    }));

  return (
    <TableWrapper>
      <SearchInfo>
        <Description
          versionType={versionType}
          numberOfVersions={versions.length}
          searchText={searchText}
        />
      </SearchInfo>
      {versions.length > 0 && (
        <Table
          data={data as any}
          columns={columns}
          caption={''}
          hideCaption={true}
        />
      )}
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

  > div:last-child {
    overflow-x: visible;
  }
`;

const SearchInfo = styled.div`
  background-color: ${skeColor.lightBlue};
  color: ${skeColor.blue100};
  padding: 12px;
`;
