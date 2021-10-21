import { IApplicationDeployment } from 'models/ApplicationDeployment';
import { RootState, ReduxProps } from 'store/types';
import { ImageTagType } from 'models/ImageTagType';
import { VersionStatus } from '../models/VersionStatus';
import { fetchVersion } from 'store/state/versions/action.creators';
import { ImageTagsConnection } from 'models/immer/ImageTagsConnection';
import { IImageTag } from 'services/auroraApiClients/imageRepositoryClient/query';
import { AuroraConfigFileResource } from 'services/auroraApiClients/applicationDeploymentClient/query';

interface IVersionViewProps {
  versionStatus: VersionStatus;
  deployment: IApplicationDeployment;
  auroraConfigFiles: AuroraConfigFileResource[];
  deploymentSpecVersion?: string;
  auroraConfigReference?: string;
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
