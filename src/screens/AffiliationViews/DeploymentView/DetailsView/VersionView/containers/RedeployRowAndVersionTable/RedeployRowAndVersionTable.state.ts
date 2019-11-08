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
  configuredVersionTag?: IImageTag;
  searchText?: string;
  deployedVersion: IImageTag;
  repository: string;
}

export const mapDispatchToProps = {
  deploy
};

export const mapStateToProps = ({ applications }: RootState) => {
  const { isDeploying } = applications;
  return {
    isDeploying
  };
};

export type IRedeployRowAndVersionTableState = ReduxProps<
  typeof mapDispatchToProps,
  typeof mapStateToProps
>;
