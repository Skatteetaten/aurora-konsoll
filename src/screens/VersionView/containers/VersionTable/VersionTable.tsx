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
  versions: IImageTag[];
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
  applicationId: string,
  tags: IImageTag[]
): IVersionTableData[] =>
  tags.map(it => {
    return {
      type: getOptionName(it.type),
      name: it.name,
      lastModified: it.image ? it.image.buildTime : '',
      deploy: (
        <DeployButtonContainer
          applicationId={applicationId}
          version={it.name}
        />
      )
    };
  });

export const VersionTabel = ({
  applicationId,
  versions
}: IVersionTableProps) => {
  return (
    <TableWrapper>
      <Table data={getVersionData(applicationId, versions)} columns={columns} />
    </TableWrapper>
  );
};

const TableWrapper = styled.div`
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

  tr:hover {
    button {
      opacity: 1;
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
