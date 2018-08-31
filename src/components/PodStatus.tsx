import * as React from 'react';

import Icon from 'aurora-frontend-react-komponenter/Icon';
import { statusColors } from 'screens/AffiliationViews/MatrixView/Status';
import { IPodResource } from 'services/AuroraApiClient/queries/applications-query';
import styled, { css } from 'styled-components';

function getDate(date?: string) {
  if (date) {
    return new Date(date).toLocaleString('nb-NO', {
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } else {
    return '-';
  }
}

interface IPodStatusProps {
  pod: IPodResource;
  className?: string;
}

// const PodStatus = ({ pod, envLink, grafanaLink, splunkLink, healthLink }) => (
const PodStatus = ({ pod, className }: IPodStatusProps) => (
  <div className={className}>
    <div className="info-tab-pod-status">
      <span>{pod.status}</span>
      <Icon name="settings" />
    </div>
    <div className="pod-content">
      <div className="info-tab-pod-keys">
        <p>Navn</p>
        <p>Ready</p>
        <p>Startet</p>
        <p>Antall omstart</p>
      </div>
      <div className="info-tab-pod-values">
        <p>{pod.name}</p>
        <p>{pod.ready ? 'Ja' : 'Nei'}</p>
        <p>{getDate(pod.startTime)}</p>
        <p>{pod.restartCount}</p>
      </div>
    </div>
  </div>
);

export default styled(PodStatus)`
  max-width: 430px;
  margin-right: 10px;
  padding-bottom: 5px;
  margin-bottom: 5px;
  margin-top: 5px;
  box-shadow: 0px 3px 8px 0px rgba(0, 0, 0, 0.2);
  background: white;

  .pod-content {
    display: flex;
    flex: 1 0 auto;
    flex-flow: row nowrap;
  }

  $icon-size: 22px;

  .info-tab-pod-status {
    text-align: center;
    border-bottom: 1px solid $ske-gray;
    margin: 0;
    padding: 5px 10px;
    margin-bottom: 5px;
    color: white;
    ${props => css`
      background: ${statusColors.healthy};
    `};

    span {
      font-weight: bold;
      float: left;
    }
    div {
      float: right;
      margin-left: 10px;
      width: $icon-size;
      height: $icon-size;
      i {
        cursor: pointer;
        font-size: $icon-size;
      }
    }
  }

  .info-tab-pod-keys {
    flex: 1 0 auto;
    padding-left: 10px;
    p {
      font-weight: bold;
    }
  }

  .info-tab-pod-values {
    flex: 1 0 auto;
    padding-right: 10px;
    margin-left: 10px;
    p {
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
`;
