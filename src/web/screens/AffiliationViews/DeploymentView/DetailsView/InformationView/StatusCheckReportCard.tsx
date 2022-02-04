import * as React from 'react';

import InfoDialog from 'web/components/InfoDialog';
import { IApplicationDeployment } from 'web/models/ApplicationDeployment';
import { toStatusColor } from 'web/models/Status';

import styled from 'styled-components';
import StatusCheckReport from './StatusCheckReport';
import ActionButton from '@skatteetaten/frontend-components/ActionButton';

interface IStatusCheckReportCardProps {
  className?: string;
  deployment: IApplicationDeployment;
}

const StatusCheckReportCard = ({
  deployment,
  className,
}: IStatusCheckReportCardProps) => {
  const { reasons, reports } = deployment.status;
  const specialChecks = reasons.filter(
    (c) => !reports.find((r) => r.name === c.name)
  );
  const reasonsToShow = specialChecks.length > 0 ? specialChecks : reasons;

  const renderOpenButton = (open: () => void) => (
    <ActionButton
      onClick={open}
      iconSize={ActionButton.LARGE}
      className="open-button"
    >
      Helsesjekkrapport
    </ActionButton>
  );

  return (
    <div className={className}>
      <div className="status-card">
        <header
          style={{
            background: toStatusColor(deployment.status.code).base,
          }}
        >
          {deployment.status.code}
        </header>
        {(reasonsToShow.length > 0 && (
          <>
            <p>Påvirkede sjekker:</p>
            <ul>
              {reasonsToShow.map((reason) => (
                <li key={reason.name}>
                  {reason.name} ({reason.failLevel})
                </li>
              ))}
            </ul>
          </>
        )) || <p>Alle sjekker er OK.</p>}
        <InfoDialog
          title="Helsesjekkrapport"
          renderOpenDialogButton={renderOpenButton}
        >
          <StatusCheckReport
            reports={deployment.status.reports}
            reasons={deployment.status.reasons}
          />
        </InfoDialog>
      </div>
    </div>
  );
};

export default styled(StatusCheckReportCard)`
  .open-button {
    padding: 15px !important;
    justify-content: center;
    display: flex;
  }

  .status-card {
    min-width: 300px;
    display: flex;
    flex-direction: column;
    box-shadow: 0px 3px 8px 0px rgba(0, 0, 0, 0.2);
    background: white;

    p {
      margin-left: 10px;
    }

    header {
      font-weight: 700;
      color: white;
      text-align: center;
      padding: 10px;
    }

    ul {
      padding-left: 20px;
      margin: 15px;
      margin-top: 0;
    }

    button {
      border-top: 1px solid #e8e8e8;
      padding: 20px;
    }
  }
`;
