import * as React from 'react';
import styled from 'styled-components';

import ActionButton from 'aurora-frontend-react-komponenter/ActionButton';

import { IManagementEndpointResponse } from 'models/Pod';
import { getTimestap } from 'utils/date';
import ErrorResponseDialog from './ErrorResponseDialog';
import SuccessResponseDialog from './SuccessResponseDialog';

interface IHealthResponseDialogProps {
  health: IManagementEndpointResponse;
  isUpdating: boolean;
  refreshApplicationDeployment: () => void;
}

const HealthResponseDialog = ({
  health,
  refreshApplicationDeployment,
  isUpdating
}: IHealthResponseDialogProps) => {
  const renderRefreshButton = () => {
    return (
      <ActionButton
        disabled={isUpdating}
        onClick={refreshApplicationDeployment}
      >
        Oppdater
      </ActionButton>
    );
  };

  const renderOpenErrorButton = (open: () => void) => (
    <StyledActionButton>
      <ActionButton
        onClick={open}
        iconSize={ActionButton.LARGE}
        color="red"
        icon="Warning"
      >
        Helsestatus
      </ActionButton>
    </StyledActionButton>
  );

  const createdAtTime = `Oppdatert: ${getTimestap(health.createdAt)}`;

  return health.hasResponse ? (
    <SuccessResponseDialog
      createdAtTime={createdAtTime}
      health={health}
      renderRefreshButton={renderRefreshButton}
    />
  ) : (
    <ErrorResponseDialog
      createdAtTime={createdAtTime}
      health={health}
      renderOpenErrorButton={renderOpenErrorButton}
      renderRefreshButton={renderRefreshButton}
    />
  );
};

const StyledActionButton = styled.div`
  display: flex;
  flex: 1;

  button {
    display: flex;
    justify-content: center;
  }
`;

export default HealthResponseDialog;
