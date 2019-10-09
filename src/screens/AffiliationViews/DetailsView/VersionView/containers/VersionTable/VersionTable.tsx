import * as React from 'react';
import Table from 'aurora-frontend-react-komponenter/Table';
import { IImageTag } from 'services/auroraApiClients/imageRepositoryClient/query';
import styled from 'styled-components';
import { DeployButtonContainer } from '../DeployButton/DeployButtonContainer';
import { ImageTagType } from 'models/ImageTagType';

interface IVersionTableData {
  deploy: JSX.Element;
  name: string;
  type: string;
  lastModified: string;
}

interface IVersionTableProps {
  affiliation: string;
  versions: IImageTag[];
  currentVersion: IImageTag;
  applicationId: string;
}

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

const getVersionData = (
  affiliation: string,
  applicationId: string,
  currentVersion: IImageTag,
  tags: IImageTag[]
): IVersionTableData[] =>
  tags
    .map(it => {
      return {
        type: getOptionName(it.type),
        name: it.name,
        lastModified: it.image ? it.image.buildTime : '',
        deploy: (
          <DeployButtonContainer
            affiliation={affiliation}
            applicationId={applicationId}
            currentVersion={currentVersion}
            nextVersion={it}
          />
        )
      };
    })
    .sort((t1, t2) => {
      if (t1.lastModified === '' || t2.lastModified === '') return 0;
      const date1 = new Date(t1.lastModified).getTime();
      const date2 = new Date(t2.lastModified).getTime();
      return date2 - date1;
    });

export const VersionTabel = ({
  affiliation,
  applicationId,
  currentVersion,
  versions
}: IVersionTableProps) => {
  const data = getVersionData(
    affiliation,
    applicationId,
    currentVersion,
    versions
  );
  const index = data.findIndex(d => d.name === currentVersion.name) + 1;
  return (
    <TableWrapper currentVersionIndex={index}>
      <Table data={data} columns={columns} />
    </TableWrapper>
  );
};

type TableWrapperProps = { currentVersionIndex: number };
const TableWrapper = styled.div<TableWrapperProps>`
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
      &:nth-child(${props => props.currentVersionIndex}) {
        background: rgb(249, 237, 226);
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
