import React from 'react';
import { connect } from 'react-redux';
import { DeployButton } from './DeployButton';
import { deploy } from 'store/state/deploy/action.creators';
import { RootState, ReduxProps } from 'store/types';
import { IImageTag } from 'services/auroraApiClients/imageRepositoryClient/query';

interface IDeployButtonContainerProps {
  affiliation: string;
  applicationId: string;
  currentVersion: IImageTag;
  version: IImageTag;
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
    isLoading: deployingVersion === version.name,
    isDeploying
  };
};

type StateProps = ReduxProps<typeof mapDispatchToProps, typeof mapStateToProps>;

type Props = IDeployButtonContainerProps & StateProps;

const DeployButtonBase = ({
  affiliation,
  applicationId,
  version,
  currentVersion,
  isLoading,
  isDeploying,
  deploy
}: Props) => {
  const performDeploy = (version: string) => {
    deploy(affiliation, applicationId, version);
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
