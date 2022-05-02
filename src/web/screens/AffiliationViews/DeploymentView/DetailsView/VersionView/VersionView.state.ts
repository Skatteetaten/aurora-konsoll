import {
  IApplicationDeployment,
  IApplicationDeploymentCommand,
} from 'web/models/ApplicationDeployment';
import { RootState, ReduxProps } from 'web/store/types';
import { ImageTagType } from 'web/models/ImageTagType';
import { VersionStatus } from '../models/VersionStatus';
import { fetchVersion } from 'web/store/state/versions/action.creators';
import { ImageTagsConnection } from 'web/models/immer/ImageTagsConnection';
import { IImageTag } from 'web/services/auroraApiClients/imageRepositoryClient/query';

interface IVersionViewProps {
  versionStatus: VersionStatus;
  deployment: IApplicationDeployment;
  applicationDeploymentCommand: IApplicationDeploymentCommand;
  deploymentSpecVersion?: string;
  isBranchDeleted: boolean;
}

export const mapDispatchToProps = {
  fetchVersion,
};

interface IState {
  imageTagsConnection: ImageTagsConnection;
  configuredVersionTag?: IImageTag;
}

export const mapStateToProps = ({ versions }: RootState): IState => {
  const { types, configuredVersionTag } = versions;

  if (!configuredVersionTag) {
    return {
      imageTagsConnection: types[ImageTagType.MAJOR],
    };
  }

  return {
    imageTagsConnection: versions.types[configuredVersionTag.type],
    configuredVersionTag,
  };
};

export type VersionViewProps = IVersionViewProps &
  ReduxProps<typeof mapDispatchToProps, typeof mapStateToProps>;
