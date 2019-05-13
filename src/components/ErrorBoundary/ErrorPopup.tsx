import * as React from 'react';
import styled from 'styled-components';

import Button from 'aurora-frontend-react-komponenter/Button';
import Callout from 'aurora-frontend-react-komponenter/Callout';
import MessageBar from 'aurora-frontend-react-komponenter/MessageBar';

import { IAppError } from 'models/StateManager/ErrorStateManager';

interface IErrorPopupProps {
  currentError: IAppError;
  closeError: (id: number) => void;
  closeErrors: () => void;
  errorCount: number;
  isCalloutVisible: boolean;
  changeCalloutVisability: () => void;
}
let buttonElement: HTMLElement | null;

const addProperties = (type: string) => {
  const parsedType = JSON.parse(type);
  const ownProps = Object.keys(parsedType);
  let i = ownProps.length;
  const resArray = new Array(i);
  while (i--) {
    resArray[i] = {
      key: ownProps[i],
      value: parsedType[ownProps[i]]
    };
  }
  const tableContent = () => {
    return resArray.forEach(it => (
      <tr>
        <th>{it}</th>
        <td>{resArray[it]}</td>
      </tr>
    ));
  };

  return <table>{tableContent}</table>;
};

const ErrorPopup = ({
  currentError,
  closeError,
  closeErrors,
  errorCount,
  changeCalloutVisability,
  isCalloutVisible
}: IErrorPopupProps) => {
  const close = () => closeError(currentError.id);
  const closeAll = () => closeErrors();
  const hasMoreErrors = errorCount > 0;

  const callout = () => (
    <div>
      <span ref={spanElement => (buttonElement = spanElement)}>
        <Button
          buttonType="secondary"
          icon="HelpOutline"
          onClick={changeCalloutVisability}
          color="black"
        >
          Vis mer informasjon
        </Button>
      </span>

      {isCalloutVisible && (
        <Callout
          target={buttonElement}
          gapSpace={5}
          directionalHint={Callout.POS_TOP_CENTER}
          color={Callout.ERROR}
          doNotLayer={false}
          truncated={true}
          overflowButtonAriaLabel="See more"
        >
          <>
            {currentError.error.stack &&
              addProperties(currentError.error.stack)}
          </>
        </Callout>
      )}
    </div>
  );

  return (
    <>
      <ErrorModal>
        <MessageBar
          type={MessageBar.Type.error}
          isMultiline={true}
          actions={
            <div>
              <MessageBar.Button onClick={close}>
                {hasMoreErrors ? 'Neste' : 'Lukk'}
              </MessageBar.Button>
              {hasMoreErrors && (
                <MessageBar.Button onClick={closeAll}>
                  Lukk alle
                </MessageBar.Button>
              )}
            </div>
          }
        >
          {callout()}
          {currentError.error.message}
          {hasMoreErrors && <p>Nye feil: {errorCount}</p>}
        </MessageBar>
      </ErrorModal>
    </>
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
