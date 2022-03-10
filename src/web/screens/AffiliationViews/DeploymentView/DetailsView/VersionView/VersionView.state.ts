import { IApplicationDeployment } from 'web/models/ApplicationDeployment';
import { RootState, ReduxProps } from 'web/store/types';
import { VersionStatus } from '../models/VersionStatus';
import { fetchVersion } from 'web/store/state/versions/action.creators';
import { ImageTagsConnection } from 'web/models/immer/ImageTagsConnection';
import { IImageTag } from 'web/services/auroraApiClients/imageRepositoryClient/query';
import { AuroraConfigFileResource } from 'web/services/auroraApiClients/applicationDeploymentClient/query';

interface IVersionViewProps {
  versionStatus: VersionStatus;
  deployment: IApplicationDeployment;
  auroraConfigFiles: AuroraConfigFileResource[];
  deploymentSpecVersion?: string;
}

export const mapDispatchToProps = {fetchVersion};

interface IState {
  imageTagsConnection: ImageTagsConnection;
  isFetching: boolean;
  configuredVersionTag?: IImageTag;
}

export const mapStateToProps = ({ versions }: RootState): IState => {
  const { configuredVersionTag, isFetching } = versions;

  if (!configuredVersionTag) {
    return {
      imageTagsConnection: versions.imageTags,
      isFetching
    };
  }

  return {
    imageTagsConnection: versions.imageTags,
    isFetching,
    configuredVersionTag
  };
};

export type VersionViewProps = IVersionViewProps &
  ReduxProps<typeof mapDispatchToProps, typeof mapStateToProps>;
