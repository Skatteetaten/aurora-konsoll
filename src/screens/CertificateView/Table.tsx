import * as React from 'react';

import SortableDetailsList from 'components/SortableDetailsList';
import { ICertificateView } from 'models/certificates';
import CertificateService, {
  filterCertificateView,
} from 'services/CertificateService';

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
