import { deploy } from 'store/state/deploy/action.creators';
import { RootState, ReduxProps } from 'store/types';
import { IImageTag } from 'services/auroraApiClients/imageRepositoryClient/query';
import { Dispatch } from 'redux';

export interface IDeployButtonProps {
  affiliation: string;
  applicationId: string;
  currentVersion: IImageTag;
  nextVersion: IImageTag;
}

export const mapDispatchToProps = (
  dispatch: Dispatch,
  { affiliation, applicationId, nextVersion }: IDeployButtonProps
) => ({
  performDeploy: () =>
    dispatch(deploy(affiliation, applicationId, nextVersion.name) as any)
});

export const mapStateToProps = (
  { deploy }: RootState,
  { nextVersion }: IDeployButtonProps
) => {
  const { deployingVersion, isDeploying } = deploy;
  return {
    isLoading: deployingVersion === nextVersion.name,
    disabled: isDeploying
  };
};

export type StateProps = ReduxProps<
  ReturnType<typeof mapDispatchToProps>,
  typeof mapStateToProps
>;
