import * as React from 'react';
import styled from 'styled-components';

import palette from 'aurora-frontend-react-komponenter/utils/palette';

import IconLink, { IIconLinkData } from 'components/IconLink';
import { IPodResource } from 'models/Pod';

import { STATUS_COLORS } from 'models/Status';
import { getLocalDatetime } from 'utils/date';
import HealthResponseDialogSelector from './HealthResponseDialogSelector/HealthResponseDialogSelector';

interface IPodStatusProps {
  pod: IPodResource;
  environmentVariables?: string;
  healthInfo?: string;
  className?: string;
  isUpdating: boolean;
  refreshApplicationDeployment: () => void;
}

function findLink(pod: IPodResource, name: string): string {
  const podLink = pod.links.find(l => l.name === name);
  return podLink ? podLink.url : '#';
}

function handleIsActive(data: IIconLinkData) {
  return data.href.startsWith('http');
}

const PodStatus = ({
  pod,
  className,
  isUpdating,
  refreshApplicationDeployment
}: IPodStatusProps) => (
  <div className={className}>
    <div className="pod-status">
      <span>{pod.phase}</span>
      <div className="pod-icons">
        <IconLink
          name="Timeline"
          isActiveHandler={handleIsActive}
          href={findLink(pod, 'metrics')}
          title="Grafana"
        />
        <IconLink
          name="FormatAlignLeft"
          isActiveHandler={handleIsActive}
          href={findLink(pod, 'splunk')}
          title="Splunk"
        />
      </div>
    </div>
    <div className="g-pod-content">
      <div className="g-pod-keys">
        <p>Navn</p>
        <p>Startet</p>
        <p>Antall omstart</p>
      </div>
      <div className="g-pod-values">
        <a
          target="_blank"
          href={findLink(pod, 'ocp_console_details')}
          title={pod.name}
        >
          {pod.name}
        </a>
        <p>{getLocalDatetime(pod.startTime)}</p>
        <p>{pod.restartCount}</p>
      </div>
    </div>
    <PodAction
      pod={pod}
      isUpdating={isUpdating}
      refreshApplicationDeployment={refreshApplicationDeployment}
    />
  </div>
);

interface IPodAction {
  pod: IPodResource;
  isUpdating: boolean;
  refreshApplicationDeployment: () => void;
}

const PodAction = ({
  pod,
  refreshApplicationDeployment,
  isUpdating
}: IPodAction) => {
  const { managementResponses } = pod;

  if (!managementResponses || !managementResponses.health) {
    return null;
  }
  return (
    <div className="pod-actions">
      <HealthResponseDialogSelector
        health={managementResponses.health}
        isUpdating={isUpdating}
        refreshApplicationDeployment={refreshApplicationDeployment}
      />
    </div>
  );
};

const { skeColor } = palette;

export default styled(PodStatus)`
  max-width: 350px;
  box-shadow: 0px 3px 8px 0px rgba(0, 0, 0, 0.2);
  background: white;

  .pod-status {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding: 5px 10px;
    color: white;
    background: ${STATUS_COLORS.healthy};

    span {
      font-weight: bold;
    }

    .pod-icons {
      display: flex;
      align-items: flex-end;
    }
  }

  .g-pod-content {
    display: grid;
    padding: 5px 10px;
    grid-template-areas: 'keys values';
    grid-template-columns: 1fr 2fr;
  }

  .g-pod-keys {
    white-space: nowrap;
    padding-right: 10px;
    grid-area: keys;
    p {
      margin: 10px 0;
      font-weight: bold;
    }
  }

  .g-pod-values {
    overflow: hidden;
    white-space: nowrap;
    grid-area: values;
    p,
    a {
      display: block;
      margin: 10px 0;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    a {
      color: ${skeColor.blue};
    }
  }

  .pod-actions {
    display: flex;
    padding: 5px 10px;
    border-top: 1px solid ${skeColor.whiteGrey};
    button {
      flex: 1;
    }
  }
`;
