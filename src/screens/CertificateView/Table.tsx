import * as React from 'react';

import SortableDetailsList from 'components/SortableDetailsList';
import { ICertificateView } from 'models/certificates';
import { SortDirection } from 'models/SortDirection';
import CertificateService, {
  certificateColumns,
  filterCertificateView
} from 'services/CertificateService';

interface ITableProps {
  certificateService: CertificateService;
  columnSortDirections: SortDirection[];
  selectedColumnIndex: number;
  viewItems: ICertificateView[];
  defaultSortDirections: SortDirection[];
  filter: string;
}

const Table = ({ viewItems, defaultSortDirections, filter }: ITableProps) => {
  return (
    <SortableDetailsList
      columns={certificateColumns}
      columnLength={certificateColumns().length}
      viewItems={viewItems}
      defaultSortDirections={defaultSortDirections}
      isHeaderVisible={true}
      filterView={filterCertificateView}
      filter={filter}
    />
  );
};

export default Table;
