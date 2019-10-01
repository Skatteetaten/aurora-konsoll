import * as React from 'react';

import InfoDialog from 'components/InfoDialog';
import { IManagementEndpointResponse } from 'models/Pod';
import { prettifyJSON } from 'utils/string';
import { StyledPre } from '../StyledPre';
import Icon from 'aurora-frontend-react-komponenter/Icon';
import palette from 'aurora-frontend-react-komponenter/utils/palette';

const { skeColor } = palette;

interface ISuccessResponseDialogProps {
  response: IManagementEndpointResponse;
  createdAtTime: string;
  title: string;
  icon: string;
  renderRefreshButton: () => JSX.Element;
}

const SuccessResponseDialog = ({
  response,
  createdAtTime,
  renderRefreshButton,
  title,
  icon
}: ISuccessResponseDialogProps) => {
  const { httpCode, textResponse } = response;
  const text = textResponse ? prettifyJSON(textResponse) : '';
  const status = httpCode ? ` (${httpCode})` : '';

  const renderOpenDialogButton = (open: () => void) => {
    return (
      <Icon
        onClick={open}
        iconName={icon}
        title={title}
        style={{
          fontSize: '23px',
          cursor: 'pointer',
          color: `${skeColor.blue}`,
          float: 'none',
          marginBottom: '2px',
          marginLeft: '4px'
        }}
      />
    );
  };

  return (
    <InfoDialog
      renderOpenDialogButton={renderOpenDialogButton}
      renderFooterButtons={renderRefreshButton}
      title={title + status}
      buttonText={title}
      subText={createdAtTime}
    >
      <StyledPre>{text}</StyledPre>
    </InfoDialog>
  );
};

export default SuccessResponseDialog;