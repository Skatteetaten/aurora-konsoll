import * as React from 'react';
import styled from 'styled-components';

import Button from 'aurora-frontend-react-komponenter/Button';
import MessageBar from 'aurora-frontend-react-komponenter/MessageBar';

import { IAppError } from 'models/StateManager/ErrorStateManager';

interface IErrorPopupProps {
  currentError: IAppError;
  closeError: (id: number) => void;
  closeErrors: () => void;
  errorCount: number;
  isExtraInfoVisable: boolean;
  changeExtraInfoVisability: () => void;
  className?: string;
}

const renderTableContent = (type: string) => {
  const parsedType = JSON.parse(type);
  const tableContents = Object.keys(parsedType).map(it => {
    return (
      <tr style={{ display: 'block' }} key={`${it}`}>
        <th style={{ textTransform: 'capitalize' }}>{`${it}:`}</th>
        <td>{parsedType[it]}</td>
      </tr>
    );
  });
  return tableContents;
};

const ErrorPopup = ({
  currentError,
  closeError,
  closeErrors,
  errorCount,
  changeExtraInfoVisability,
  isExtraInfoVisable,
  className
}: IErrorPopupProps) => {
  const close = () => {
    closeError(currentError.id);
  };
  const closeAll = () => {
    closeErrors();
  };

  const hasMoreErrors = errorCount > 0;
  return (
    <ErrorModal>
      <MessageBar
        type={MessageBar.Type.error}
        isMultiline={true}
        actions={
          <div style={{ alignItems: 'inherit', width: '100%' }}>
            <Button
              buttonType="secondary"
              icon="helpFilled"
              onClick={changeExtraInfoVisability}
              color="black"
              style={{ paddingLeft: '14px' }}
            >
              Vis mer informasjon
            </Button>
            <div style={{ float: 'right' }}>
              {hasMoreErrors && (
                <MessageBar.Button onClick={closeAll}>
                  Lukk alle
                </MessageBar.Button>
              )}
              <MessageBar.Button onClick={close}>
                {hasMoreErrors ? 'Neste' : 'Lukk'}
              </MessageBar.Button>
            </div>
          </div>
        }
      >
        {currentError.error.message}
        {isExtraInfoVisable && (
          <table>
            <tbody>
              {!!currentError.error.stack &&
                renderTableContent(currentError.error.stack)}
              {!!currentError.error.name &&
                renderTableContent(currentError.error.name)}
            </tbody>
          </table>
        )}
        {hasMoreErrors && <p>Nye feil: {errorCount}</p>}
      </MessageBar>
    </ErrorModal>
  );
};

const ErrorModal = styled.div`
  z-index: 200;
  background: white;
  position: absolute;
  min-width: 400px;
  max-width: 600px;
  max-height: 300px;
  right: 20px;
  bottom: 20px;
`;

export default ErrorPopup;
