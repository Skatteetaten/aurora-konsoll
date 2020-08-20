import { default as AuroraSpinner } from '@skatteetaten/frontend-components/Spinner';
import * as React from 'react';
import { SpinnerSize } from 'office-ui-fabric-react/lib-commonjs';

interface ISpinnerProps {
  className?: string;
}

// TODO: denne kan vel fjernes. Virker som om den er gammel. Vi kan bruke direkte fra frontend components
const Spinner = ({ className }: ISpinnerProps) => (
  <div className={className}>
    <AuroraSpinner size={SpinnerSize.large} />
  </div>
);

export default Spinner;
