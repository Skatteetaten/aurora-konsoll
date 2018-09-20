import * as React from 'react';
import { IPodResource } from 'services/auroraApiClients/applicationDeploymentClient/query';
import { getLocalDatetime } from 'utils/date';
import InfoDialog from './InfoDialog';

interface IHealthResponseDialog {
  pod: IPodResource;
}

const HealthResponseDialog = ({ pod }: IHealthResponseDialog) => (
  <InfoDialog title="Helsestatus" subText={`Cached: ${getCachedTime(pod)}`}>
    <pre>{getTextResponsePrettyfied(pod)}</pre>
  </InfoDialog>
);

export default HealthResponseDialog;

function getCachedTime(pod: IPodResource) {
  return getLocalDatetime(pod.managementResponses.health.loadedTime, {
    second: '2-digit'
  });
}

function getTextResponsePrettyfied(pod: IPodResource) {
  return parseAndStringify(pod.managementResponses.health.textResponse);
}

function parseAndStringify(text: string) {
  return JSON.stringify(JSON.parse(text), undefined, '  ');
}
