import * as React from 'react';

import { Button, Spinner } from '@skatteetaten/frontend-components';
import { SpinnerSize } from 'office-ui-fabric-react/lib-commonjs';

interface ILoadingButtonProps {
  loading: boolean;
  icon?: string;
  [key: string]: any;
}

const LoadingButton = ({
  children,
  loading,
  icon,
  ...props
}: ILoadingButtonProps) => (
  <Button
    buttonStyle="primaryRoundedFilled"
    icon={loading ? undefined : icon}
    disabled={loading}
    {...props}
  >
    {loading ? <Spinner size={SpinnerSize.large} /> : children}
  </Button>
);

export default LoadingButton;
