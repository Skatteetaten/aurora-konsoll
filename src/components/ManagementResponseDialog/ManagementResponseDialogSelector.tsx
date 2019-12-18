import * as React from 'react';

import ActionButton from '@skatteetaten/frontend-components/ActionButton';

import { IManagementEndpointResponse } from 'models/Pod';
import { getTimestamp } from 'utils/date';
import ErrorResponseDialog from './ErrorResponseDialog';
import SuccessResponseDialog from './SuccessResponseDialog';

interface IManagementResponseDialogSelectorProps {
  response: IManagementEndpointResponse;
  isUpdating: boolean;
  title: string;
  icon: string;
  refreshApplicationDeployment: () => void;
}

const ManagementResponseDialogSelector = ({
  response,
  refreshApplicationDeployment,
  isUpdating,
  title,
  icon
}: IManagementResponseDialogSelectorProps) => {
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

  const createdAtTime = `Oppdatert: ${getTimestamp(response.createdAt)}`;

  return !response.error ? (
    <SuccessResponseDialog
      icon={icon}
      title={title}
      createdAtTime={createdAtTime}
      response={response}
      renderRefreshButton={renderRefreshButton}
    />
  ) : (
    <ErrorResponseDialog
      icon={icon}
      createdAtTime={createdAtTime}
      response={response}
      renderRefreshButton={renderRefreshButton}
    />
  );
};

export default ManagementResponseDialogSelector;
