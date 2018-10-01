import * as React from 'react';
import styled from 'styled-components';

import MessageBar from 'aurora-frontend-react-komponenter/MessageBar';

import InfoDialog from 'components/InfoDialog';
import { IAppError } from 'models/StateManager/ErrorStateManager';

interface IErrorPopupProps {
  err: IAppError;
  closeError: (id: number) => void;
  errorCount: number;
}

const ErrorPopup = ({ err, closeError, errorCount }: IErrorPopupProps) => {
  const close = () => closeError(err.id);
  const hasMoreErrors = errorCount > 0;
  return (
    <ErrorModal>
      <MessageBar
        type={MessageBar.Type.error}
        actions={
          <div>
            <MessageBar.Button onClick={close}>
              {hasMoreErrors ? 'next' : 'close'}
            </MessageBar.Button>
            <InfoDialog title="Stack" buttonStyle="primaryRounded">
              <p>{err.error.stack}</p>
            </InfoDialog>
          </div>
        }
      >
        {err.error.message}
        {hasMoreErrors && <p>New errors: {errorCount}</p>}
      </MessageBar>
    </ErrorModal>
  );
};

const ErrorModal = styled.div`
  z-index: 100;
  background: white;
  position: absolute;
  min-width: 400px;
  max-width: 600px;
  max-height: 300px;
  right: 20px;
  bottom: 20px;
`;

export default ErrorPopup;
