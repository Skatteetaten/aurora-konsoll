import { RootState, ReduxProps } from 'web/store/types';
import {
  getAreasAndTenant,
  getAreas,
} from 'web/store/state/storageGrid/action.creators';
import { AreasAndTenant } from 'web/services/auroraApiClients';

interface Props {
  affiliation: string;
  storageGridInformationUrl?: string;
}

export const mapDispatchToProps = {
  getAreasAndTenant,
  getAreas,
};

interface State {
  isFetchingAreas: boolean;
  isFetchingAreasAndTenant: boolean;
  areasAndTenant?: AreasAndTenant;
}

export const mapStateToProps = ({ storageGrid }: RootState): State => {
  const { isFetchingAreas, isFetchingAreasAndTenant, areasAndTenant } =
    storageGrid;

  return {
    isFetchingAreas,
    isFetchingAreasAndTenant,
    areasAndTenant,
  };
};

export type StorageGridViewRoutesProps = Props &
  ReduxProps<typeof mapDispatchToProps, typeof mapStateToProps>;
