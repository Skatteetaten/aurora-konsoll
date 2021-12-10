import * as React from 'react';

import SortableDetailsList from 'web/components/SortableDetailsList';
import { ICertificateView } from 'web/models/certificates';
import CertificateService, {
  filterCertificateView,
} from 'web/services/CertificateService';

interface ITableProps {
  certificateService: CertificateService;
  viewItems: ICertificateView[];
  filter: string;
}

const Table = ({ viewItems, filter }: ITableProps) => {
  return (
    <SortableDetailsList
      columns={CertificateService.DEFAULT_COLUMNS}
      items={viewItems}
      isHeaderVisible={true}
      filterView={filterCertificateView}
      filter={filter}
    />
  );
};

export default Table;
