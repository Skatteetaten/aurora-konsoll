import { IApplicationDeployment } from 'web/models/ApplicationDeployment';
import { RootState, ReduxProps } from 'web/store/types';
import { ImageTagType } from 'web/models/ImageTagType';
import { VersionStatus } from '../models/VersionStatus';
import { fetchVersion } from 'web/store/state/versions/action.creators';
import { ImageTagsConnection } from 'web/models/immer/ImageTagsConnection';
import { IImageTag } from 'web/services/auroraApiClients/imageRepositoryClient/query';

interface IVersionViewProps {
  versionStatus: VersionStatus;
  deployment: IApplicationDeployment;
  gitReference?: string;
  deploymentSpecVersion?: string;
}

export const mapDispatchToProps = {
  fetchVersion,
};

interface IState {
  imageTagsConnection: ImageTagsConnection;
  configuredVersionTag?: IImageTag;
  deploymentErrors?: Error[];
}

export const mapStateToProps = ({
  versions,
  applications,
}: RootState): IState => {
  const { types, configuredVersionTag } = versions;
  const { requestApplicationDeployment } = applications.errors;

  if (!configuredVersionTag) {
    return {
      imageTagsConnection: types[ImageTagType.MAJOR],
      deploymentErrors: requestApplicationDeployment,
    };
  }

  return {
    imageTagsConnection: versions.types[configuredVersionTag.type],
    configuredVersionTag,
  };
};

export type VersionViewProps = IVersionViewProps &
  ReduxProps<typeof mapDispatchToProps, typeof mapStateToProps>;
