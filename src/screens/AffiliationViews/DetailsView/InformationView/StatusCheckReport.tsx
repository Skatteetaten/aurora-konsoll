import DetailsList from 'aurora-frontend-react-komponenter/DetailsList';
import Icon from 'aurora-frontend-react-komponenter/Icon';
import palette from 'aurora-frontend-react-komponenter/utils/palette';
import * as React from 'react';

import { StatusCode, toStatusColor } from 'models/Status';
import { IStatusCheck } from 'services/auroraApiClients/applicationDeploymentClient/query';

interface IStatusCheckReportProps {
  mainStatusName?: string;
  statusChecks: IStatusCheck[];
}

const columns = [
  {
    key: 'column0',
    name: '',
    fieldName: 'active',
    minWidth: 50,
    maxWidth: 100
  },
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
    isResizable: true
  }
];

function getIconStatusStyle(statusCheck: IStatusCheck): React.CSSProperties {
  const { skeColor } = palette;
  const color: string = statusCheck.hasFailed
    ? toStatusColor(statusCheck.failLevel).base
    : skeColor.green;
  return {
    color,
    fontSize: '28px'
  };
}

function getStatusIcon(statusCheck: IStatusCheck): string {
  if (!statusCheck.hasFailed) {
    return 'Done';
  }
  switch (statusCheck.failLevel) {
    case StatusCode.DOWN:
      return 'Error';
    case StatusCode.OBSERVE:
      return 'Warning';
    case StatusCode.OFF:
      return 'Info';
    case StatusCode.HEALTHY:
      return 'Done';
  }
}

const StatusCheckReport = ({
  mainStatusName,
  statusChecks
}: IStatusCheckReportProps) => (
  <DetailsList
    columns={columns}
    items={statusChecks
      // .sort(a => (a.name === mainStatusName ? -1 : 0))
      .map(it => ({
        ...it,
        active: (
          <Icon
            iconName={getStatusIcon(it)}
            style={getIconStatusStyle(it)}
            title={it.hasFailed ? it.failLevel : StatusCode.HEALTHY}
          />
        )
      }))}
  />
);

export default StatusCheckReport;
