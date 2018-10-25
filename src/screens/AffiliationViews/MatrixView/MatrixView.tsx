import * as React from 'react';
import styled from 'styled-components';

import LoadingButton from 'components/LoadingButton';
import TimeSince from 'components/TimeSince';

import withApplicationDeployments from '../ApplicationDeploymentContext';
import { default as MatrixBase } from './Matrix';

const Matrix = withApplicationDeployments(MatrixBase);

interface IMatrixViewProps {
  time: string;
  isRefreshing: boolean;
  refreshApplicationDeployments: () => void;
  className?: string;
}

const MatrixView = ({
  className,
  isRefreshing,
  refreshApplicationDeployments,
  time
}: IMatrixViewProps) => (
  <div className={className}>
    <ActionBar>
      <TimeSince timeSince={time} />
      <LoadingButton
        style={{ minWidth: '120px' }}
        loading={isRefreshing}
        onClick={refreshApplicationDeployments}
      >
        Oppdater
      </LoadingButton>
    </ActionBar>
    <Matrix />
  </div>
);

const ActionBar = styled.div`
  display: flex;
  padding: 10px;
  align-items: center;
  justify-content: flex-end;
  flex-shrink: 0;
  height: 40px;

  button {
    min-width: 120px;
  }
`;

export default styled(MatrixView)`
  display: flex;
  flex-direction: column;
  max-height: 100%;
`;