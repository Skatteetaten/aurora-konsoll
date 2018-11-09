import * as React from 'react';

import InfoDialog from 'components/InfoDialog';
import { IManagementEndpointResponse } from 'models/Pod';
import { prettifyJSON } from 'utils/string';
import StyledPre from './StyledPre';

interface IErrorResponseDialogProps {
  health: IManagementEndpointResponse;
  createdAtTime: string;
  renderRefreshButton: () => JSX.Element;
  renderOpenErrorButton: (open: () => void) => JSX.Element;
}

const ErrorResponseDialog = ({
  health,
  createdAtTime,
  renderRefreshButton,
  renderOpenErrorButton
}: IErrorResponseDialogProps) => {
  const { httpCode, error } = health;

  if (!error) {
    return null;
  }

  const text = error.message ? prettifyJSON(error.message) : '';

  return (
    <InfoDialog
      renderFooterButtons={renderRefreshButton}
      renderOpenDialogButton={renderOpenErrorButton}
      title="Feil fra helsesjekk"
      subText={createdAtTime}
    >
      <>
        {httpCode && <p>HTTP Code: {httpCode}</p>}
        <StyledPre>{text}</StyledPre>
      </>
    </InfoDialog>
  );
};

export default ErrorResponseDialog;
