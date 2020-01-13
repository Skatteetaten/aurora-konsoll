import { ImageTagType } from 'models/ImageTagType';
import { IImageTag } from 'services/auroraApiClients/imageRepositoryClient/query';
import { ReduxProps, RootState } from 'store/types';

export interface IVersionTableProps {
  onConfirmDeploy: (version: string) => void;
  hasAccessToDeploy: boolean;
  versionType: ImageTagType;
  currentVersion: IImageTag;
  versionBeingDeployed?: string;
  configuredVersionTag?: IImageTag;
  releaseTo?: string;
}

export const mapStateToProps = (
  { versions }: RootState,
  { versionType }: IVersionTableProps
) => ({
  imageTagsConnection: versions.types[versionType]
});

export type VersionTableState = ReduxProps<{}, typeof mapStateToProps>;
