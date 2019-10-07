import { connect } from 'react-redux';
import { ImageTagType } from 'models/ImageTagType';
import { RootState } from 'store/types';
import { VersionTypeSelector } from './VersionTypeSelector';
import { TotalCountMap } from './VersionTypeSelector.types';

const mapStateToProps = ({ versions }: RootState) => {
  const types = Object.values(ImageTagType).filter(
    type => type !== ImageTagType.SEARCH
  );
  return {
    totalCountMap: types.reduce(
      (obj, type) => ({
        ...obj,
        [type]: versions.types[type].totalCount
      }),
      {} as TotalCountMap
    )
  };
};

export const VersionTypeSelectorContainer = connect(mapStateToProps)(
  VersionTypeSelector
);
