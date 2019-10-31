import { IApplicationDeployment } from 'models/ApplicationDeployment';
import { RootState } from 'store/types';
import { ImageTagType } from 'models/ImageTagType';
import { ImageTagsConnection } from 'models/immer/ImageTagsConnection';
import { IImageTag } from 'services/auroraApiClients/imageRepositoryClient/query';
import { VersionStatus } from '../models/VersionStatus';

interface IVersionViewProps {
  versionStatus: VersionStatus;
  affiliation: string;
  deployment: IApplicationDeployment;
  configuredVersion?: string;
}

interface IState {
  imageTagsConnection: ImageTagsConnection;
  configuredVersionTag?: IImageTag;
}

export const mapStateToProps = (
  { versions }: RootState,
  { configuredVersion }: IVersionViewProps
): IState => {
  const { types } = versions;

  const defaultState: IState = {
    imageTagsConnection: types[ImageTagType.MAJOR],
    configuredVersionTag: undefined
  };

  if (!configuredVersion) {
    return defaultState;
  }

  const obj = Object.values(types).reduce<{
    index: number;
    type?: ImageTagType;
  }>(
    (found, imageTagConnection) => {
      const index = imageTagConnection.findVersionIndex(configuredVersion);
      if (!found.type && index !== -1) {
        return {
          index,
          type: imageTagConnection.getType()
        };
      }
      return found;
    },
    {
      index: -1,
      type: undefined
    }
  );

  if (!obj.type) {
    return defaultState;
  }

  return {
    imageTagsConnection: versions.types[obj.type],
    configuredVersionTag: types[obj.type].getVersions()[obj.index]
  };
};

export type VersionViewProps = IVersionViewProps & IState;
