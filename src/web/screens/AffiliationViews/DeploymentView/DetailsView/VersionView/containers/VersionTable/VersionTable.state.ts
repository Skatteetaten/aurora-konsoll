import { ImageTagType } from 'web/models/ImageTagType';
import { IImageTag } from 'web/services/auroraApiClients/imageRepositoryClient/query';
import { ReduxProps, RootState } from 'web/store/types';

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
  imageTagsConnection: versions.types[versionType],
});

export type VersionTableState = ReduxProps<{}, typeof mapStateToProps>;