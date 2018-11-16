import * as React from 'react';

import InfoDialog from 'components/InfoDialog';
import { IManagementEndpointResponse } from 'models/Pod';
import { prettifyJSON } from 'utils/string';
import { StyledPre } from './utilComponents';

interface ISuccessResponseDialogProps {
  health: IManagementEndpointResponse;
  createdAtTime: string;
  renderRefreshButton: () => JSX.Element;
}

const SuccessResponseDialog = ({
  health,
  createdAtTime,
  renderRefreshButton
}: ISuccessResponseDialogProps) => {
  const { httpCode, textResponse } = health;
  const text = textResponse ? prettifyJSON(textResponse) : '';
  const status = httpCode ? ` (${httpCode})` : '';

  return (
    <InfoDialog
      renderFooterButtons={renderRefreshButton}
      title={'Helsestatus' + status}
      buttonText="Helsestatus"
      subText={createdAtTime}
    >
      <StyledPre>{text}</StyledPre>
    </InfoDialog>
  );
};

export default SuccessResponseDialog;
