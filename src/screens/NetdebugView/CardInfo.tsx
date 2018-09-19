import * as React from 'react';
import styled from 'styled-components';

import palette from 'aurora-frontend-react-komponenter/utils/palette';

import Indicator, { IndicatorColor } from './Indicator';

interface ICardProps {
  netdebugStatus: string;
  lastScan: string;
  className?: string;
  displayTableOnClicked: () => void;
}

const getIndicatorColor = (netdebugStatus: string) => {
  if (netdebugStatus === 'OPEN') {
    return IndicatorColor.GREEN;
  } else if (netdebugStatus === ('DNS_FAILED' || 'UNKOWN')) {
    return IndicatorColor.RED;
  }
  return IndicatorColor.GRAY;
};

const CardInfo = ({
  displayTableOnClicked,
  lastScan,
  className,
  netdebugStatus
}: ICardProps) => (
  <div className={className}>
    <Indicator color={getIndicatorColor(netdebugStatus)} />
    <div className="card-info-center">
      <h1>{netdebugStatus}</h1>
    </div>
    <div className="card-info-center">
      <h3>{lastScan}</h3>
      <article>
        {netdebugStatus === 'OPEN' && <>Kan nåes fra alle noder.</>} Klikk{' '}
        <div className="datalink-styled">
          {' '}
          <a onClick={displayTableOnClicked}>her</a>
        </div>{' '}
        for mer informasjon.
      </article>
    </div>
  </div>
);

const { skeColor } = palette;

export default styled(CardInfo)`
  background: ${skeColor.neutralGrey};
  padding: 22px;

  .card-info-center {
    text-align: center;
    > h3 {
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
