import * as React from 'react';

import ActionButton from '@skatteetaten/frontend-components/ActionButton';
import LoadingButton from 'components/LoadingButton';
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
  refreshApplicationDeployment,
}: IDetailsActionBarProps) => (
  <div className={className}>
    <ActionButton
      className="back-button"
      buttonStyle="primary"
      color="black"
      icon="Back"
      onClick={goToDeploymentsPage}
    >
      Tilbake
    </ActionButton>
    <h1>{title}</h1>
    <TimeSince timeSince={updatedTime} />
    <LoadingButton
      style={{ minWidth: '141px' }}
      loading={isRefreshing}
      onClick={refreshApplicationDeployment}
      icon="Update"
    >
      Oppdater
    </LoadingButton>
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
`;
