import * as React from 'react';

import Button from '@skatteetaten/frontend-components/Button';
import Spinner from './Spinner';

interface ILoadingButtonProps {
  loading: boolean;
  [key: string]: any;
}

const LoadingButton = ({
  children,
  loading,
  ...props
}: ILoadingButtonProps) => (
  <Button buttonStyle="primaryRoundedFilled" disabled={loading} {...props}>
    {loading ? <Spinner /> : children}
  </Button>
);

export default LoadingButton;
