import * as React from 'react';

import { Icon } from '@skatteetaten/frontend-components/Icon';
import { DetailsList } from '@skatteetaten/frontend-components/DetailsList';
import Collapse from 'web/components/Collapse';
import { StatusCode, toStatusColor } from 'web/models/Status';
import { IStatusCheck } from 'web/services/auroraApiClients/applicationDeploymentClient/query';
import styled from 'styled-components';
import { SkeBasis } from '@skatteetaten/frontend-components/SkeBasis';

const { skeColor } = SkeBasis.PALETTE;

interface IStatusCheckReportProps {
  reports: IStatusCheck[];
  reasons: IStatusCheck[];
}

const columns = [
  {
    key: 'column0',
    name: '',
    fieldName: 'active',
    minWidth: 50,
  },
  {
    key: 'column1',
    name: 'Statussjekk',
    fieldName: 'name',
    minWidth: 250,
    isResizable: true,
  },
  {
    key: 'column2',
    name: 'Beskrivelse',
    fieldName: 'description',
    minWidth: 750,
    isResizable: true,
  },
];

function getIconStatusStyle(
  hasFailed: boolean,
  level: StatusCode,
  fontSize: string = '28px'
): React.CSSProperties {
  const color: string = hasFailed ? toStatusColor(level).base : skeColor.green;
  return {
    color,
    fontSize,
  };
}

function getStatusIcon(hasFailed: boolean, level: StatusCode): string {
  if (!hasFailed) {
    return 'Check';
  }
  switch (level) {
    case StatusCode.DOWN:
      return 'Error';
    case StatusCode.OBSERVE:
      return 'Warning';
    case StatusCode.OFF:
      return 'Info';
    case StatusCode.HEALTHY:
      return 'Check';
    default:
      return '';
  }
}

const StatusCheckReport = ({ reports, reasons }: IStatusCheckReportProps) => {
  const renderDeployList = (list: IStatusCheck[]) => (
    <DetailsList
      columns={columns}
      items={[...list]
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((it) => ({
          ...it,
          active: (
            <Icon
              iconName={getStatusIcon(it.hasFailed, it.failLevel)}
              style={getIconStatusStyle(it.hasFailed, it.failLevel)}
              title={it.hasFailed ? it.failLevel : StatusCode.HEALTHY}
            />
          ),
        }))}
    />
  );

  const specialChecks = reasons.filter(
    (c) => !reports.find((r) => r.name === c.name)
  );

  const standardChecks = {
    hiddenBecauseMessage: '',
    isCollapsed: false,
  };

  if (specialChecks.length > 0) {
    const joinedChecks = specialChecks.map((it) => it.name).join(',');
    standardChecks.hiddenBecauseMessage = `Utgår pga. spesialsjekk: ${joinedChecks}`;
    standardChecks.isCollapsed = true;
  }

  return (
    <div className="status-checks">
      {specialChecks.length > 0 && (
        <>
          <h3>Spesialsjekker</h3>
          {renderDeployList(specialChecks)}
        </>
      )}
      <h3>
        Standardsjekker{' '}
        {standardChecks.isCollapsed && (
          <small style={{ color: 'grey' }}>
            {standardChecks.hiddenBecauseMessage}
          </small>
        )}
      </h3>
      {standardChecks.isCollapsed ? (
        <Collapse isCollapsed={standardChecks.isCollapsed}>
          {renderDeployList(reports)}
        </Collapse>
      ) : (
        renderDeployList(reports)
      )}
      <div style={{ display: 'flex', marginTop: '20px' }}>
        <StatusIconInfo code={StatusCode.HEALTHY} />
        <StatusIconInfo code={StatusCode.OBSERVE} />
        <StatusIconInfo code={StatusCode.DOWN} />
        <StatusIconInfo code={StatusCode.OFF} />
      </div>
    </div>
  );
};

interface IStatusIconInfoProps {
  code: StatusCode;
  title?: string;
  hasFailed?: boolean;
}

const StatusIconInfo = ({
  code,
  title,
  hasFailed = true,
}: IStatusIconInfoProps) => (
  <StatusIconInfoWrapper>
    <Icon
      iconName={getStatusIcon(true, code)}
      style={getIconStatusStyle(hasFailed, code, '24px')}
    />{' '}
    = {title || code.toString()}
  </StatusIconInfoWrapper>
);

const StatusIconInfoWrapper = styled.span`
  display: flex;
  align-items: center;
  margin-right: 15px;
  font-size: 14px;
`;

export default StatusCheckReport;
