import { ImageTagType } from 'web/models/ImageTagType';
import { VersionStatus } from '../../../models/VersionStatus';
import { IImageTag } from 'web/services/auroraApiClients/imageRepositoryClient/query';
import { deploy } from 'web/store/state/applicationDeployments/action.creators';
import { ReduxProps, RootState } from 'web/store/types';
import { AuroraConfigFileResource } from 'web/services/auroraApiClients/applicationDeploymentClient/query';
import { addCurrentErrors } from 'web/screens/ErrorHandler/state/actions';

export interface IRedeployRowAndVersionTableProps {
  versionType: ImageTagType;
  applicationId: string;
  hasAccessToDeploy: boolean;
  versionStatus: VersionStatus;
  deployedVersion: IImageTag;
  releaseTo?: string;
  auroraConfigFiles: AuroraConfigFileResource[];
  affiliation: string;
}

export const mapDispatchToProps = {
  deploy,
  addCurrentErrors,
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
