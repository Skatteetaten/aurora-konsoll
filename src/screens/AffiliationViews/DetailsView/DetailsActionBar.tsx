import * as React from 'react';

import ActionButton from 'aurora-frontend-react-komponenter/ActionButton';
import Button from 'aurora-frontend-react-komponenter/Button';
import Spinner from 'components/Spinner';
import TimeSince from 'components/TimeSince';
import styled from 'styled-components';

interface IDetailsActionBarProps {
  title: string;
  isRefreshing: boolean;
  updatedTime: string;
  className?: string;
  goToDeploymentsPage: () => void;
  refreshApplicationDeployment: () => void;
}

const DetailsActionBar = ({
  title,
  isRefreshing,
  updatedTime,
  className,
  goToDeploymentsPage,
  refreshApplicationDeployment
}: IDetailsActionBarProps) => (
  <div className={className}>
    <ActionButton
      className="back-button"
      buttonType="primary"
      color="black"
      icon="Back"
      onClick={goToDeploymentsPage}
    >
      Tilbake
    </ActionButton>
    <h1>{title}</h1>
    <TimeSince timeSince={updatedTime} />
    <Button
      style={{ minWidth: '120px' }}
      className="refresh-button"
      buttonType="primaryRoundedFilled"
      onClick={refreshApplicationDeployment}
    >
      {isRefreshing ? <Spinner /> : 'Oppdater'}
    </Button>
  </div>
);

export default styled(DetailsActionBar)`
  display: flex;
  margin: 10px;
  align-items: center;
  h1 {
    flex: 1;
    margin: 0;
    font-size: 24px;
    text-align: center;
  }
  .back-button {
    margin-left: -10px;
  }
  .refresh-button {
    justify-self: flex-end;
    min-width: 125px;
  }
`;
