import * as React from 'react';

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
    const refreshApplicationDeployment = () => {
      this.props.refreshApplicationDeployment();
    };
    return (
      <ActionButton onClick={refreshApplicationDeployment}>
        Oppdater
      </ActionButton>
    );
  };

  public render() {
    return (
      <InfoDialog
        renderFooterButtons={this.renderFooterButtons}
        title="Helsestatus"
        subText={`Oppdatert: ${getCachedTime(this.props.health)}`}
      >
        <pre>{getTextResponsePrettyfied(this.props.health)}</pre>
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
