import { useMemo, useState } from 'react';
import StorageGridDialog from './components/StorageGridDialog';
import TextField from '@skatteetaten/frontend-components/TextField';

import {
  ActionBarButtonsContainer,
  ActionBarContainer,
  ViewContainer,
} from 'web/components/DetailsListUtils/styles';
import StorageGridTable from './components/StorageGridTable';
import LoadingButton from 'web/components/LoadingButton';
import DetailsList from '@skatteetaten/frontend-components/DetailsList';
import { StorageGridObjectArea } from 'web/services/auroraApiClients/storageGridClient/query';

interface Props {
  activeAreas?: StorageGridObjectArea[];
  isFetchingAreas: boolean;
  getAreas: () => void;
}

const StorageGridView = ({ activeAreas, getAreas, isFetchingAreas }: Props) => {
  const [selectedItem, setSelectedItem] = useState<object[] | undefined>(
    undefined
  );
  const [filter, setFilter] = useState('');

  const selection = useMemo(
    () =>
      new DetailsList.Selection({
        onSelectionChanged: () => {
          setSelectedItem(selection.getSelection());
        },
      }),
    [setSelectedItem]
  );

  return (
    <ViewContainer>
      <ActionBarContainer>
        <TextField
          placeholder="Søk etter område"
          onChange={(_, val) => setFilter(val || '')}
          value={filter}
          style={{ width: '300px' }}
        />
        <ActionBarButtonsContainer>
          <LoadingButton
            onClick={() => getAreas()}
            icon="Update"
            style={{
              minWidth: '141px',
              marginLeft: '15px',
            }}
            loading={isFetchingAreas}
          >
            Oppdater
          </LoadingButton>
        </ActionBarButtonsContainer>
      </ActionBarContainer>
      <StorageGridTable
        filter={filter}
        selection={selection}
        storageGridAreas={activeAreas}
      />
      <StorageGridDialog selected={selectedItem} selection={selection} />
    </ViewContainer>
  );
};

export default StorageGridView;
