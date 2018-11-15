import * as React from 'react';

import ActionButton from 'aurora-frontend-react-komponenter/ActionButton';
import MessageBar from 'aurora-frontend-react-komponenter/MessageBar';
import InfoDialog from 'components/InfoDialog';
import { IManagementEndpointResponse } from 'models/Pod';
import styled from 'styled-components';
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
  const status = httpCode ? ` (${httpCode})` : '';

  return (
    <InfoDialog
      renderFooterButtons={renderRefreshButton}
      renderOpenDialogButton={renderOpenErrorButton}
      title={'Feil fra helsesjekk' + status}
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
