import { ImageTagType } from 'models/ImageTagType';
import { VersionStatus } from '../../../models/VersionStatus';
import { IImageTag } from 'services/auroraApiClients/imageRepositoryClient/query';
import { deploy } from 'store/state/applicationDeployments/action.creators';
import { ReduxProps, RootState } from 'store/types';

export interface IRedeployRowAndVersionTableProps {
  versionType: ImageTagType;
  applicationId: string;
  hasAccessToDeploy: boolean;
  versionStatus: VersionStatus;
  deployedVersion: IImageTag;
  releaseTo?: string;
}

export const mapDispatchToProps = {
  deploy,
};

export const mapStateToProps = ({ applications, versions }: RootState) => {
  const { isDeploying } = applications;
  const { configuredVersionTag, isFetchingConfiguredVersionTag } = versions;
  return {
    isDeploying,
    configuredVersionTag,
    isFetchingConfiguredVersionTag,
  };
};

export type IRedeployRowAndVersionTableState = ReduxProps<
  typeof mapDispatchToProps,
  typeof mapStateToProps
>;
