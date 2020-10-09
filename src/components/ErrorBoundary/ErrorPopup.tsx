import * as React from 'react';
import styled from 'styled-components';

import Button from '@skatteetaten/frontend-components/Button';
import ActionButton from '@skatteetaten/frontend-components/ActionButton';
import MessageBar from '@skatteetaten/frontend-components/MessageBar';
import { IAppError } from 'models/errors';
import { Link } from 'react-router-dom';

interface IErrorPopupProps {
  currentError: IAppError;
  errorCount: number;
  className?: string;
  closeError: (id: number) => void;
  closeErrors: () => void;
}

const renderTableContent = (type: string): JSX.Element[] => {
  const parsedType = JSON.parse(type);
  return Object.keys(parsedType).map((it) => (
    <tr key={`${it}`}>
      <th>{`${it}:`}</th>
      <td>{`${parsedType[it]}`}</td>
    </tr>
  ));
};

const ErrorPopup = ({
  currentError,
  closeError,
  closeErrors,
  errorCount,
  className,
}: IErrorPopupProps) => {
  const [expandMessageBar, setExpandMessageBar] = React.useState(false);
  const hasMoreErrors = errorCount > 0;

  const isAppRereshFailedCode =
    currentError.error.stack &&
    JSON.parse(currentError.error.stack)?.code === 'APP_REFRESH_FAILED';

  const messageBarType = isAppRereshFailedCode
    ? MessageBar.Type.info
    : MessageBar.Type.error;

  const displayAppRefreshFailedError = () => {
    if (isAppRereshFailedCode && currentError.error.stack) {
      const path = window.location.pathname;
      const oldApplicationDeploymentId = path.split('/')[4];
      const newApplicationDeploymentId = JSON.parse(currentError.error.stack)
        .applicationDeploymentId;
      const newPath = path.replace(
        oldApplicationDeploymentId,
        newApplicationDeploymentId
      );
      return (
        <>
          <br />
          Trykk <Link to={newPath}>her</Link> for å gå inn på den nye urlen til
          applikasjonen
          <br />
          Du kan også gå tilbake til matrise visningen og trykke på oppdater, så
          vil applikasjonen dukke opp
        </>
      );
    }
  };

  return (
    <div className={className}>
      <div className="errorModal">
        <MessageBar
          type={messageBarType}
          isMultiline={true}
          actions={
            <div className="action-bar">
              {(currentError.error.stack || currentError.error.name) && (
                <ActionButton
                  onClick={() => setExpandMessageBar(!expandMessageBar)}
                  iconSize={ActionButton.LARGE}
                  icon={!expandMessageBar ? 'ChevronDown' : 'ChevronUp'}
                  className="expand-button"
                >
                  {!expandMessageBar ? 'Vis info' : 'Skjul'}
                </ActionButton>
              )}
              <div className="close-button">
                {hasMoreErrors && (
                  <Button onClick={() => closeErrors()}>Lukk alle</Button>
                )}
                <Button onClick={() => closeError(currentError.id)}>
                  {hasMoreErrors ? 'Neste' : 'Lukk'}
                </Button>
              </div>
            </div>
          }
        >
          {currentError.error.message}
          {displayAppRefreshFailedError()}
          {expandMessageBar && (
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
      </div>
    </div>
  );
};

export default styled(ErrorPopup)`
  z-index: 200;
  background: white;
  position: absolute;
  width: 100%;
  max-width: 550px;
  max-height: 600px;
  right: 20px;
  bottom: 20px;

  .action-bar {
    align-items: inherit;
    width: 100%;
    .expand-button {
      padding-left: 14px;
    }
    .close-button {
      float: right;
    }
  }

  table {
    overflow: auto;
    display: block;
    max-height: 200px;

    tr {
      overflow: hidden;
      display: block;
    }
    th {
      text-transform: capitalize;
      white-space: nowrap;
    }
  }
`;
