import React from 'react';
import { RootState } from 'store/types';
import { connect } from 'react-redux';
import MessageBar from 'aurora-frontend-react-komponenter/MessageBar';

const mapStateToProps = ({ deploy }: RootState) => {
  return {
    lastDeploy: deploy.lastDeploy
  };
};

type Props = ReturnType<typeof mapStateToProps>;

const DeployResultMessage = ({ lastDeploy }: Props) => {
  if (!lastDeploy) {
    return null;
  }

  if (lastDeploy.success) {
    return (
      <MessageBar type={MessageBar.Type.success}>
        Applikasjonen har blitt deployet med versjon {lastDeploy.version}
      </MessageBar>
    );
  }

  return (
    <MessageBar type={MessageBar.Type.warning}>
      Applikasjonen har ikke blitt deployet med versjon {lastDeploy.version}
    </MessageBar>
  );
};

export const DeployResultMessageContainer = connect(mapStateToProps)(
  DeployResultMessage
);
