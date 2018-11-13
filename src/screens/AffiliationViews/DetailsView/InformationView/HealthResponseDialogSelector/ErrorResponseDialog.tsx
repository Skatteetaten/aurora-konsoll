import * as React from 'react';

import ActionButton from 'aurora-frontend-react-komponenter/ActionButton';
import InfoDialog from 'components/InfoDialog';
import { IManagementEndpointResponse } from 'models/Pod';
import { prettifyJSON } from 'utils/string';
import { StyledActionButton, StyledPre } from './utilComponents';

interface IErrorResponseDialogProps {
  health: IManagementEndpointResponse;
  createdAtTime: string;
  renderRefreshButton: () => JSX.Element;
}

const ErrorResponseDialog = ({
  health,
  createdAtTime,
  renderRefreshButton
}: IErrorResponseDialogProps) => {
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

  const { httpCode, textResponse, error } = health;
  const text = (textResponse && prettifyJSON(textResponse)) || textResponse;

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
        {error && <StyledPre>{error.code}</StyledPre>}
        {error && error.message && <StyledPre>{error.message}</StyledPre>}
      </>
    </InfoDialog>
  );
};

export default ErrorResponseDialog;
