import * as React from 'react';
import styled from 'styled-components';

import ActionButton from 'aurora-frontend-react-komponenter/ActionButton';

import InfoDialog from 'components/InfoDialog';
import { IHttpResponse } from 'models/Pod';
import { getLocalDatetime } from 'utils/date';

interface IHealthResponseDialogProps {
  health: IHttpResponse;
  refreshApplicationDeployment: () => void;
}

const HealthResponseDialog = ({
  health,
  refreshApplicationDeployment
}: IHealthResponseDialogProps) => {
  const renderRefreshButton = () => {
    return (
      <ActionButton onClick={refreshApplicationDeployment}>
        Oppdater
      </ActionButton>
    );
  };

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

  const loadedTimeText = `Oppdatert: ${getCachedTime(health.loadedTime)}`;

  return health.hasResponse ? (
    <InfoDialog
      renderFooterButtons={renderRefreshButton}
      title="Helsestatus"
      subText={loadedTimeText}
    >
      <StyledPre>{getTextResponsePrettyfied(health.textResponse)}</StyledPre>
    </InfoDialog>
  ) : (
    <InfoDialog
      renderOpenDialogButton={renderOpenErrorButton}
      title="Feil fra helsesjekk"
      subText={loadedTimeText}
    >
      <StyledPre>{getTextResponsePrettyfied(health.error)}</StyledPre>
    </InfoDialog>
  );
};

const StyledActionButton = styled.div`
  display: flex;
  flex: 1;

  button {
    display: flex;
    justify-content: center;
  }
`;

const StyledPre = styled.pre`
  max-width: 1500px;
  max-height: 700px;
  overflow: auto;
`;

function getCachedTime(time: string) {
  return getLocalDatetime(time, {
    day: undefined,
    month: undefined,
    second: '2-digit',
    year: undefined
  });
}

function getTextResponsePrettyfied(text: string) {
  return parseAndStringify(text);
}

function parseAndStringify(text: string) {
  return JSON.stringify(JSON.parse(text), undefined, '  ');
}

export default HealthResponseDialog;
