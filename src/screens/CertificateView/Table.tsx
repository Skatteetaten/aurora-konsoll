import * as React from 'react';

import SortableDetailsList from 'components/SortableDetailsList';
import { ICertificateView } from 'models/certificates';
import CertificateService, {
  certificateColumns,
  filterCertificateView
} from 'services/CertificateService';

interface ITableProps {
  certificateService: CertificateService;
  viewItems: ICertificateView[];
  filter: string;
}

const Table = ({ viewItems, filter }: ITableProps) => {
  return (
    <SortableDetailsList
      columns={certificateColumns}
      viewItems={viewItems}
      isHeaderVisible={true}
      filterView={filterCertificateView}
      filter={filter}
    />
  );
};

export default Table;
