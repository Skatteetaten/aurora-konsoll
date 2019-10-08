import * as React from 'react';
import Table from 'aurora-frontend-react-komponenter/Table';
import { getOptionName } from 'screens/AffiliationViews/DetailsView/VersionView/TagTypeSelector/TagTypeSelector';
import { IImageTag } from 'services/auroraApiClients/imageRepositoryClient/query';
import styled from 'styled-components';
import { DeployButtonContainer } from 'screens/VersionView/containers/DeployButton/DeployButtonContainer';

interface IVersionTableData {
  deploy: JSX.Element;
  name: string;
  type: string;
  lastModified: string;
}

interface IVersionTableProps {
  affiliation: string;
  versions: IImageTag[];
  currentVersion: string;
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

const getVersionData = (
  affiliation: string,
  applicationId: string,
  currentVersion: string,
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
            version={it.name}
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
  return (
    <TableWrapper>
      <Table
        data={getVersionData(
          affiliation,
          applicationId,
          currentVersion,
          versions
        )}
        columns={columns}
      />
    </TableWrapper>
  );
};

const TableWrapper = styled.div`
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
    tr:hover {
      background: #cde1f9;
      button {
        opacity: 1;
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
