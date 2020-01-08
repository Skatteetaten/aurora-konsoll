import { ImageTagType } from 'models/ImageTagType';
import { VersionStatus } from '../../../models/VersionStatus';
import { IImageTag } from 'services/auroraApiClients/imageRepositoryClient/query';
import { deploy } from 'store/state/applicationDeployments/action.creators';
import { ReduxProps, RootState } from 'store/types';
import { fetchVersion } from 'store/state/versions/action.creators';

export interface IRedeployRowAndVersionTableProps {
  versionType: ImageTagType;
  applicationId: string;
  hasAccessToDeploy: boolean;
  versionStatus: VersionStatus;
  deploymentSpecVersion?: string;
  searchText?: string;
  deployedVersion: IImageTag;
  repository: string;
}

export const mapDispatchToProps = {
  deploy,
  fetchVersion
};

export const mapStateToProps = ({ applications, versions }: RootState) => {
  const { isDeploying } = applications;
  const { configuredVersionTag } = versions;
  return {
    isDeploying,
    configuredVersionTag
  };
};

export type IRedeployRowAndVersionTableState = ReduxProps<
  typeof mapDispatchToProps,
  typeof mapStateToProps
>;
