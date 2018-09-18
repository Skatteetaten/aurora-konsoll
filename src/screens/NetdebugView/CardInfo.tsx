import * as React from 'react';

import Card from 'aurora-frontend-react-komponenter/Card';
import styled from 'styled-components';

import Indicator, { IndicatorColor } from './Indicator';

const Center = styled.div`
  text-align: center;
  > h3 {
    color: grey;
  }
  h1,
  p {
    margin: 0;
  }
`;

const DataLink = styled.a`
  color: blue;
  cursor: pointer;
  &:hover {
    color: red;
    background-color: transparent;
    text-decoration: underline;
  }
`;

interface ICardProps {
  netdebugStatus: string;
  lastScan: string;
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
  netdebugStatus
}: ICardProps) => (
  <Card>
    <Indicator color={getIndicatorColor(netdebugStatus)} />
    <Center>
      <h1>{netdebugStatus}</h1>
    </Center>
    <Center>
      <h3>{lastScan}</h3>
      <p>
        {netdebugStatus === 'OPEN' && <>Kan nåes fra alle noder.</>}
        Klikk <DataLink onClick={displayTableOnClicked}>her</DataLink> for mer
        informasjon.
      </p>
    </Center>
  </Card>
);

export default CardInfo;
