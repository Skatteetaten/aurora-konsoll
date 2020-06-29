import React from 'react';

import MessageBar from '@skatteetaten/frontend-components/MessageBar';
import InfoDialog from 'components/InfoDialog';
import { IManagementEndpointResponse } from 'models/Pod';
import styled from 'styled-components';
import { prettifyJSON } from 'utils/string';
import { StyledPre } from 'components/StyledPre';
import { getTheme } from '@uifabric/styling';
import Icon from '@skatteetaten/frontend-components/Icon';
import { PaletteProps } from '@skatteetaten/frontend-components';

interface IErrorResponseDialogProps {
  response: IManagementEndpointResponse;
  createdAtTime: string;
  icon: string;
  title: string;
  renderRefreshButton: () => JSX.Element;
}

const ErrorResponseDialog = ({
  response,
  createdAtTime,
  renderRefreshButton,
  title,
  icon,
}: IErrorResponseDialogProps) => {
  const palette = getTheme().palette as PaletteProps;
  const renderOpenErrorButton = (open: () => void) => (
    <Icon
      onClick={open}
      iconName={icon}
      title={title}
      style={{
        fontSize: '25px',
        cursor: 'pointer',
        color: `${palette.skeColor.error}`,
        float: 'none',
        marginLeft: '4px',
      }}
    />
  );

  const { httpCode, textResponse, error } = response;
  const text = (textResponse && prettifyJSON(textResponse)) || textResponse;
  const status = httpCode ? ` (${httpCode})` : '';

  return (
    <InfoDialog
      renderFooterButtons={renderRefreshButton}
      renderOpenDialogButton={renderOpenErrorButton}
      title={'Feil fra endepunkt' + status}
      subText={createdAtTime}
    >
      <>
        {error && <ErrorContent code={error.code} message={error.message} />}
        {text ? <StyledPre>{text}</StyledPre> : <p>Ingen body</p>}
      </>
    </InfoDialog>
  );
};

const Content = styled.div`
  margin-bottom: 10px;

  .error-code-bar {
    display: flex;
    justify-content: space-between;
  }

  .error-message {
    margin-top: 10px;
    max-width: 400px;
  }

  span {
    width: 100%;
  }

  p {
    margin: 0;
  }
`;

interface IErrorContentProps {
  code: string;
  message?: string;
  className?: string;
}

const ErrorContent = ({ code, message, className }: IErrorContentProps) => (
  <Content>
    <MessageBar
      type={MessageBar.Type.error}
      isMultiline={true}
      className={className}
    >
      <>
        <div className="error-code-bar">
          <p>{code}</p>
        </div>
        {message && <p className="error-message">{message}</p>}
      </>
    </MessageBar>
  </Content>
);

export default ErrorResponseDialog;
