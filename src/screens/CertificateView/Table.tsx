import * as React from 'react';

import DetailsList from 'aurora-frontend-react-komponenter/DetailsList';
import CertificateService from 'services/CertificateService';
import { SortDirection } from 'services/DatabaseSchemaService';

interface ITableProps {
  items: any[];
  onColumnHeaderClick: (
    ev: React.MouseEvent<HTMLElement, MouseEvent>,
    column: { key: number; fieldName: string }
  ) => void;
  certificateService: CertificateService;
  columnSortDirections: SortDirection[];
  selectedColumnIndex: number;
}

const Table = ({
  items,
  onColumnHeaderClick,
  certificateService,
  columnSortDirections,
  selectedColumnIndex
}: ITableProps) => {
  return (
    <DetailsList
      columns={certificateService.createColumns(
        selectedColumnIndex,
        columnSortDirections[selectedColumnIndex]
      )}
      items={items}
      onColumnHeaderClick={onColumnHeaderClick}
    />
  );
};

export default Table;
