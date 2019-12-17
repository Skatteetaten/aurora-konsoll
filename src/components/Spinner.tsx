import { default as AuroraSpinner } from '@skatteetaten/frontend-components/Spinner';
import * as React from 'react';
import styled from 'styled-components';

interface ISpinnerProps {
  className?: string;
}

const Spinner = ({ className }: ISpinnerProps) => (
  <div className={className}>
    <AuroraSpinner size={AuroraSpinner.Size && AuroraSpinner.Size['large']} />
  </div>
);

export default styled(Spinner)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
