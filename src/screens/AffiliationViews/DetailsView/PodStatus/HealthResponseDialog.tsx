import * as React from 'react';

import InfoDialog from 'components/InfoDialog';
import { IHttpResponse } from 'models/Pod';
import { getLocalDatetime } from 'utils/date';

interface IHealthResponseDialog {
  health: IHttpResponse;
}

const HealthResponseDialog = ({ health }: IHealthResponseDialog) => (
  <InfoDialog title="Helsestatus" subText={`Cached: ${getCachedTime(health)}`}>
    <pre>{getTextResponsePrettyfied(health)}</pre>
  </InfoDialog>
);

export default HealthResponseDialog;

function getCachedTime(response: IHttpResponse) {
  return getLocalDatetime(response.loadedTime, {
    second: '2-digit'
  });
}

function getTextResponsePrettyfied(response: IHttpResponse) {
  return parseAndStringify(response.textResponse);
}

function parseAndStringify(text: string) {
  return JSON.stringify(JSON.parse(text), undefined, '  ');
}
