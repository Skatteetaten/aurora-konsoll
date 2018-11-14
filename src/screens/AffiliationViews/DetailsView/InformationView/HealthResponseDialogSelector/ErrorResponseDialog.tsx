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

  return (
    <InfoDialog
      renderFooterButtons={renderRefreshButton}
      renderOpenDialogButton={renderOpenErrorButton}
      title="Feil fra helsesjekk"
      subText={createdAtTime}
    >
      <>
        {error && (
          <ErrorContent
            httpCode={httpCode}
            code={error.code}
            message={error.message}
          />
        )}
        <StyledPre>{text}</StyledPre>
      </>
    </InfoDialog>
  );
};

const Content = styled.div`
  .error-code-bar {
    display: flex;
    justify-content: space-between;
  }

  p {
    margin: 0;
  }
`;

interface IErrorContentProps {
  httpCode?: number;
  code: string;
  message?: string;
  className?: string;
}

const ErrorContent = ({
  code,
  httpCode,
  message,
  className
}: IErrorContentProps) => (
  <MessageBar
    type={MessageBar.Type.error}
    isMultiline={true}
    className={className}
  >
    <Content>
      <div className="error-code-bar">
        <p>{code}</p>
        {httpCode && <p className="error-http-status">HTTP: {httpCode}</p>}
      </div>
      {message && <p>{message}</p>}
    </Content>
  </MessageBar>
);

export default ErrorResponseDialog;
