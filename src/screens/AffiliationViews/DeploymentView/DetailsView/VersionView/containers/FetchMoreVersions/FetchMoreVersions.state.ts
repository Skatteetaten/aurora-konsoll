import { ImageTagType } from 'models/ImageTagType';
import { RootState, ReduxProps } from 'store/types';
import { fetchVersions } from 'store/state/versions/action.creators';

export interface IFetchMoreVersionsProps {
  versionType: ImageTagType;
  searchText?: string;
  repository: string;
}

export const mapDispatchToProps = {
  fetchVersions
};

export const mapStateToProps = (
  { versions }: RootState,
  { versionType }: IFetchMoreVersionsProps
) => ({
  imageTagsConnection: versions.types[versionType],
  isFetching: versions.isFetching[versionType]
});

export type FetchMoreVersionsState = ReduxProps<
  typeof mapDispatchToProps,
  typeof mapStateToProps
>;
