import * as React from 'react';

import Button from 'aurora-frontend-react-komponenter/Button';
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
  <Button buttonType="primaryRoundedFilled" disabled={loading} {...props}>
    {loading ? <Spinner /> : children}
  </Button>
);

export default LoadingButton;