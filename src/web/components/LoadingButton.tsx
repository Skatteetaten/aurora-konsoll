import * as React from 'react';

import { Button } from '@skatteetaten/frontend-components/Button';
import { Spinner } from '@skatteetaten/frontend-components/Spinner';
import { SpinnerSize } from '@fluentui/react';

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
    buttonStyle="primary"
    icon={loading ? undefined : icon}
    disabled={loading}
    {...props}
  >
    {loading ? <Spinner size={SpinnerSize.small} /> : children}
  </Button>
);

export default LoadingButton;
