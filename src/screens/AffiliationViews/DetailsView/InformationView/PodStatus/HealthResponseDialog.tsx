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

export default class HealthResponseDialog extends React.Component<
  IHealthResponseDialogProps,
  {}
> {
  public renderFooterButtons = () => {
    const { refreshApplicationDeployment } = this.props;
    const refreshOnClicked = () => {
      refreshApplicationDeployment();
    };
    return <ActionButton onClick={refreshOnClicked}>Oppdater</ActionButton>;
  };

  public render() {
    const { health } = this.props;
    return (
      <InfoDialog
        renderFooterButtons={this.renderFooterButtons}
        title="Helsestatus"
        subText={`Oppdatert: ${getCachedTime(health)}`}
      >
        <StyledPre>{getTextResponsePrettyfied(health)}</StyledPre>
      </InfoDialog>
    );
  }
}

function getCachedTime(response: IHttpResponse) {
  return getLocalDatetime(response.loadedTime, {
    day: undefined,
    month: undefined,
    second: '2-digit',
    year: undefined
  });
}

function getTextResponsePrettyfied(response: IHttpResponse) {
  return parseAndStringify(response.textResponse);
}

function parseAndStringify(text: string) {
  return JSON.stringify(JSON.parse(text), undefined, '  ');
}

const StyledPre = styled.pre`
  max-width: 1500px;
  max-height: 700px;
  overflow: auto;
`;

export default HealthResponseDialog;
