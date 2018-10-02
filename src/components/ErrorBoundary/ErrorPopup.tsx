import * as React from 'react';
import styled from 'styled-components';

import MessageBar from 'aurora-frontend-react-komponenter/MessageBar';

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
        isMultiline={true}
        actions={
          <div>
            <MessageBar.Button onClick={close}>
              {hasMoreErrors ? 'Neste' : 'Lukk'}
            </MessageBar.Button>
          </div>
        }
      >
        {err.error.message}
        {hasMoreErrors && <p>Nye feil: {errorCount}</p>}
      </MessageBar>
    </ErrorModal>
  );
};

const ErrorModal = styled.div`
  z-index: 9000;
  background: white;
  position: absolute;
  min-width: 400px;
  max-width: 600px;
  max-height: 300px;
  right: 20px;
  bottom: 20px;
`;

export default ErrorPopup;
