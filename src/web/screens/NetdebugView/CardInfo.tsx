import * as React from 'react';
import styled from 'styled-components';

import ActionButton from '@skatteetaten/frontend-components/ActionButton';
import { SkeBasis } from '@skatteetaten/frontend-components/SkeBasis';

import { INetdebugResult } from 'web/services/auroraApiClients';

import Indicator, { IndicatorColor } from './Indicator';

interface ICardProps {
  netdebugStatus: string;
  parsedData: INetdebugResult;
  lastScan: string;
  className?: string;
  displayTableOnClicked: () => void;
}

const getIndicatorColor = (netdebugStatus: string) => {
  switch (netdebugStatus) {
    case 'OPEN':
      return IndicatorColor.GREEN;
    case 'DNS_FAILED':
    case 'UNKNOWN':
    case 'FILTERED':
    case 'CLOSED':
      return IndicatorColor.RED;
    default:
      return IndicatorColor.GRAY;
  }
};

const CardInfo = ({
  displayTableOnClicked,
  lastScan,
  className,
  netdebugStatus,
  parsedData,
}: ICardProps) => (
  <div className={className}>
    <Indicator color={getIndicatorColor(netdebugStatus)} />
    <div className="card-info-center">
      <h1>{netdebugStatus}</h1>
    </div>
    <div className="card-info-center">
      <h3>{lastScan}</h3>
      <h4>
        {parsedData.open.length} åpne noder, {parsedData.failed.length} stengte
        noder
      </h4>
      <article>
        {netdebugStatus === 'OPEN' && <>Kan nåes fra alle noder.</>}
        <br />
        <ActionButton onClick={displayTableOnClicked}>
          Klikk her for mer informasjon
        </ActionButton>
      </article>
    </div>
  </div>
);

const { skeColor } = SkeBasis.PALETTE;

export default styled(CardInfo)`
  background: ${skeColor.neutralGrey};
  padding: 22px;

  .card-info-center {
    text-align: center;
    > h3,
    h4 {
      color: grey;
    }
    h1,
    p {
      margin: 0;
    }
  }

  .datalink-styled {
    display: inline;
    color: blue;
    cursor: pointer;
    &:hover {
      color: red;
      background-color: transparent;
      text-decoration: underline;
    }
  }
`;
