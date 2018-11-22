import * as React from 'react';

import ActionButton from 'aurora-frontend-react-komponenter/ActionButton';

import { IManagementEndpointResponse } from 'models/Pod';
import { getTimestamp } from 'utils/date';
import ErrorResponseDialog from './ErrorResponseDialog';
import SuccessResponseDialog from './SuccessResponseDialog';

interface IHealthResponseDialogSelectorProps {
  health: IManagementEndpointResponse;
  isUpdating: boolean;
  refreshApplicationDeployment: () => void;
}

const HealthResponseDialogSelector = ({
  health,
  refreshApplicationDeployment,
  isUpdating
}: IHealthResponseDialogSelectorProps) => {
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

  const createdAtTime = `Oppdatert: ${getTimestamp(health.createdAt)}`;

  return !health.error ? (
    <SuccessResponseDialog
      createdAtTime={createdAtTime}
      health={health}
      renderRefreshButton={renderRefreshButton}
    />
  ) : (
    <ErrorResponseDialog
      createdAtTime={createdAtTime}
      health={health}
      renderRefreshButton={renderRefreshButton}
    />
  );
};

export default HealthResponseDialogSelector;
