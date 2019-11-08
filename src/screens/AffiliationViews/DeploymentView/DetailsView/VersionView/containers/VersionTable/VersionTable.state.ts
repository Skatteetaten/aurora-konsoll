import { ImageTagType } from 'models/ImageTagType';
import { IImageTag } from 'services/auroraApiClients/imageRepositoryClient/query';
import { ReduxProps, RootState } from 'store/types';
import { fetchVersions } from 'store/state/versions/action.creators';

export interface IVersionTableProps {
  hasAccessToDeploy: boolean;
  affiliation: string;
  versionType: ImageTagType;
  searchText?: string;
  repository: string;
  applicationId: string;
  currentVersion: IImageTag;
}

export const mapDispatchToProps = {
  fetchVersions
};

export const mapStateToProps = (
  { versions }: RootState,
  { versionType }: IVersionTableProps
) => ({
  imageTagsConnection: versions.types[versionType],
  isFetching: versions.isFetching[versionType]
});

export type VersionTableState = ReduxProps<
  typeof mapDispatchToProps,
  typeof mapStateToProps
>;
