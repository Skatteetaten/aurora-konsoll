import * as React from 'react';

import Button from '@skatteetaten/frontend-components/Button';
import { SpinnerSize } from 'office-ui-fabric-react';
import Spinner from './Spinner';

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
    {loading ? <Spinner /> : children}
  </Button>
);

export default LoadingButton;
