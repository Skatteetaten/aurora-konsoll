import * as React from 'react';

import DetailsList from 'aurora-frontend-react-komponenter/DetailsList';
import { ICertificateView } from 'models/certificates';
import { SortDirection } from 'models/SortDirection';
import CertificateService from 'services/CertificateService';

interface ITableProps {
  items: ICertificateView[];
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
