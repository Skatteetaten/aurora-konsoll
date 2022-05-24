import { useEffect, useState } from 'react';
import { TableContainer } from 'web/components/DetailsListUtils/styles';
import { ScrollablePane } from '@fluentui/react';
import DetailsList from '@skatteetaten/frontend-components/DetailsList';
import { initColumns } from '../utils/columns';
import { Selection, IObjectWithKey } from '@fluentui/react';
import { getLocalDate } from 'web/utils/date';
import StatusIcon from '../utils/StatusIcon';
import { StorageGridObjectArea } from 'web/services/auroraApiClients/storageGridClient/query';

interface Props {
  filter: string;
  storageGridAreas?: StorageGridObjectArea[];
  selection: Selection<IObjectWithKey>;
}

export interface StorageGridObjectAreasTableData {
  name: string;
  bucketName: string;
  namespace: string;
  creationTimestamp: string;
  statusSuccess: JSX.Element;
  statusMessage: string;
  statusReason: string;
}

const StorageGridTable = ({ filter, storageGridAreas, selection }: Props) => {
  const [items, setItems] = useState<StorageGridObjectAreasTableData[]>([]);
  const [columns, setColumns] = useState(initColumns);

  const filterObjectAreas =
    (filter: string) => (sgoa: StorageGridObjectAreasTableData) =>
      sgoa.bucketName.toLowerCase().includes(filter) ||
      sgoa.creationTimestamp.toLowerCase().includes(filter) ||
      sgoa.name.toLowerCase().includes(filter);

  useEffect(() => {
    if (storageGridAreas) {
      setItems(
        storageGridAreas?.map((it) => {
          return {
            ...it,
            creationTimestamp: getLocalDate(it.creationTimestamp),
            statusSuccess: StatusIcon({ status: it.status.success }),
            statusMessage: it.status.message,
            statusReason: it.status.reason,
          };
        })
      );
    }
  }, [storageGridAreas]);

  return (
    <TableContainer>
      <ScrollablePane>
        <DetailsList
          columns={columns}
          items={items.filter(filterObjectAreas(filter.toLowerCase()))}
          onSortUpdate={({ items, columns }) => {
            setItems(items);
            setColumns(columns);
          }}
          selection={selection}
          selectionMode={DetailsList.SelectionMode.single}
        />
      </ScrollablePane>
    </TableContainer>
  );
};

export default StorageGridTable;