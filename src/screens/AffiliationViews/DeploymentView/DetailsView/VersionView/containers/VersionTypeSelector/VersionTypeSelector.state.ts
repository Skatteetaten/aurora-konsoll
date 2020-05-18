import { RootState, ReduxProps } from 'store/types';
import { clearStateForType } from 'store/state/versions/action.creators';
import { ImageTagType } from 'models/ImageTagType';

import { TotalCountMap } from './VersionTypeSelector.types';

export const mapStateToProps = ({ versions }: RootState) => {
  const types = Object.values(ImageTagType).filter(
    (type) => type !== ImageTagType.SEARCH
  );
  return {
    totalCountMap: types.reduce(
      (obj, type) => ({
        ...obj,
        [type]: versions.types[type].totalVersionsCount(),
      }),
      {} as TotalCountMap
    ),
  };
};

export const mapDispatchToProps = {
  clearStateForType,
};

export type VersionTypeSelectorState = ReduxProps<
  typeof mapDispatchToProps,
  typeof mapStateToProps
>;
