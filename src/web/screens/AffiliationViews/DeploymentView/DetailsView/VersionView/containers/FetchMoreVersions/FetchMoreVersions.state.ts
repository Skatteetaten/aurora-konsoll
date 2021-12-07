import { ImageTagType } from 'web/models/ImageTagType';
import { RootState, ReduxProps } from 'web/store/types';
import { fetchVersions } from 'web/store/state/versions/action.creators';

export interface IFetchMoreVersionsProps {
  versionType: ImageTagType;
  searchText?: string;
  repository: string;
}

export const mapDispatchToProps = {
  fetchVersions,
};

export const mapStateToProps = (
  { versions }: RootState,
  { versionType }: IFetchMoreVersionsProps
) => ({
  imageTagsConnection: versions.types[versionType],
  isFetching: versions.isFetching,
});

export type FetchMoreVersionsState = ReduxProps<
  typeof mapDispatchToProps,
  typeof mapStateToProps
>;
