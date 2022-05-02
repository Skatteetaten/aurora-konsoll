import { ImageTagType } from 'web/models/ImageTagType';
import { VersionStatus } from '../../../models/VersionStatus';
import {
  IImageTag,
  IVersion,
} from 'web/services/auroraApiClients/imageRepositoryClient/query';
import { deploy } from 'web/store/state/applicationDeployments/action.creators';
import { ReduxProps, RootState } from 'web/store/types';
import { IApplicationDeploymentCommand } from 'web/models/ApplicationDeployment';

export interface IRedeployRowAndVersionTableProps {
  versionType: ImageTagType;
  applicationId: string;
  hasAccessToDeploy: boolean;
  versionStatus: VersionStatus;
  deployedVersion: IImageTag;
  releaseTo?: string;
  affiliation: string;
  environment: string;
  applicationName: string;
  isBranchDeleted: boolean;
  versions: IVersion[];
  searchText: string;
  applicationDeploymentCommand: IApplicationDeploymentCommand;
}

export const mapDispatchToProps = { deploy };

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
