import { IApplicationDeployment } from 'models/ApplicationDeployment';
import { RootState } from 'store/types';
import { ImageTagType } from 'models/ImageTagType';
import { ImageTagsConnection } from 'models/immer/ImageTagsConnection';
import { VersionStatus } from '../models/VersionStatus';

interface IVersionViewProps {
  versionStatus: VersionStatus;
  deployment: IApplicationDeployment;
  deploymentSpecVersion?: string;
}

interface IState {
  imageTagsConnection: ImageTagsConnection;
}

export const mapStateToProps = ({ versions }: RootState): IState => {
  const { types, configuredVersionTag } = versions;

  if (!configuredVersionTag) {
    return {
      imageTagsConnection: types[ImageTagType.MAJOR]
    };
  }

  return {
    imageTagsConnection: versions.types[configuredVersionTag.type]
  };
};

export type VersionViewProps = IVersionViewProps & IState;
