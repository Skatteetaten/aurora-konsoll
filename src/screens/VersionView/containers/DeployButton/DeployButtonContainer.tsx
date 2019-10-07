import React from 'react';
import { connect } from 'react-redux';
import { DeployButton } from './DeployButton';
import { deploy } from 'store/state/deploy/action.creators';
import { RootState, ReduxProps } from 'store/types';

interface IDeployButtonContainerProps {
  applicationId: string;
  currentVersion: string;
  version: string;
}

const mapDispatchToProps = {
  deploy
};

const mapStateToProps = (
  { deploy }: RootState,
  { version }: IDeployButtonContainerProps
) => {
  const { deployingVersion, isDeploying } = deploy;
  return {
    isLoading: deployingVersion === version,
    isDeploying
  };
};

type StateProps = ReduxProps<typeof mapDispatchToProps, typeof mapStateToProps>;

type Props = IDeployButtonContainerProps & StateProps;

const DeployButtonBase = ({
  applicationId,
  version,
  currentVersion,
  isLoading,
  isDeploying,
  deploy
}: Props) => {
  const performDeploy = () => {
    deploy(applicationId, version);
  };

  return (
    <DeployButton
      previousVersion={currentVersion}
      nextVersion={version}
      onDeploy={performDeploy}
      isLoading={isLoading}
      disabled={isDeploying}
    />
  );
};

export const DeployButtonContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(DeployButtonBase);
