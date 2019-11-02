import { ImageTagType } from 'models/ImageTagType';
import { IImageTag } from 'services/auroraApiClients/imageRepositoryClient/query';
import { ReduxProps, RootState } from 'store/types';
import { fetchVersions } from 'store/state/versions/action.creators';

export interface IVersionTableProps {
  onConfirmDeploy: (version: string) => void;
  hasAccessToDeploy: boolean;
  versionType: ImageTagType;
  searchText?: string;
  repository: string;
  currentVersion: IImageTag;
  versionBeingDeployed?: string;
}

export const mapDispatchToProps = {
  fetchVersions
};

export const mapStateToProps = (
  { versions }: RootState,
  { versionType }: IVersionTableProps
) => ({
  imageTagsConnection: versions.types[versionType],
  isFetching: versions.isFetching
});

export type VersionTableState = ReduxProps<
  typeof mapDispatchToProps,
  typeof mapStateToProps
>;
