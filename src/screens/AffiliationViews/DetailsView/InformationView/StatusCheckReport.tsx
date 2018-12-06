import DetailsList from 'aurora-frontend-react-komponenter/DetailsList';
import * as React from 'react';

import { IStatusCheck } from 'services/auroraApiClients/applicationDeploymentClient/query';

interface IStatusCheckReportProps {
  statusChecks: IStatusCheck[];
}

const columns = [
  {
    key: 'column1',
    name: 'Statussjekk',
    fieldName: 'name',
    minWidth: 100,
    maxWidth: 250,
    isResizable: true
  },
  {
    key: 'column2',
    name: 'Beskrivelse',
    fieldName: 'description',
    minWidth: 100,
    maxWidth: 700,
    isResizable: true
  },
  {
    key: 'column3',
    name: 'Nivå',
    fieldName: 'failLevel',
    minWidth: 100,
    maxWidth: 100
  },
  {
    key: 'column4',
    name: 'Påvirket',
    fieldName: 'active',
    minWidth: 100,
    maxWidth: 100
  }
];

const StatusCheckReport = ({ statusChecks }: IStatusCheckReportProps) => (
  <DetailsList
    columns={columns}
    items={statusChecks.map(it => ({
      ...it,
      active: it.hasFailed ? 'Ja' : 'Nei'
    }))}
  />
);

export default StatusCheckReport;
