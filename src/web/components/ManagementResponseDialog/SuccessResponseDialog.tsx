import React from 'react';

import InfoDialog from 'web/components/InfoDialog';
import { IManagementEndpointResponse } from 'web/models/Pod';
import { prettifyJSON } from 'web/utils/string';
import { StyledPre } from '../StyledPre';
import { Icon } from '@skatteetaten/frontend-components/Icon';
import { SkeBasis } from '@skatteetaten/frontend-components/SkeBasis';

const { skeColor } = SkeBasis.PALETTE;

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
  icon,
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
          fontSize: '25px',
          cursor: 'pointer',
          color: `${skeColor.blue}`,
          float: 'none',
          marginLeft: '4px',
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
