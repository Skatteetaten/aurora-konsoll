import * as React from 'react';

import InfoDialog from 'components/InfoDialog';
import { IManagementEndpointResponse } from 'models/Pod';
import { prettifyJSON } from 'utils/string';
import { StyledPre } from './utilComponents';
import Icon from 'aurora-frontend-react-komponenter/Icon';
import palette from 'aurora-frontend-react-komponenter/utils/palette';

const { skeColor } = palette;

interface ISuccessResponseDialogProps {
  health: IManagementEndpointResponse;
  createdAtTime: string;
  renderRefreshButton: () => JSX.Element;
}

const renderOpenDialogButton = (open: () => void) => {
  return (
    <Icon
      onClick={open}
      iconName="Favorite"
      style={{ cursor: 'pointer', color: `${skeColor.blue}` }}
    />
  );
};

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
      renderOpenDialogButton={renderOpenDialogButton}
      renderFooterButtons={renderRefreshButton}
      title={'Pod helsestatus' + status}
      buttonText="Pod helsestatus"
      subText={createdAtTime}
    >
      <StyledPre>{text}</StyledPre>
    </InfoDialog>
  );
};

export default SuccessResponseDialog;
