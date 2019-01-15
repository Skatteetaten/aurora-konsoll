import * as React from 'react';

import Button from 'aurora-frontend-react-komponenter/Button';

export interface ICounterProps {
  label: string;
  count: number;
  onIncrement: () => any;
}

export const counter = (props: ICounterProps) => {
  const { label, count, onIncrement } = props;

  const handleIncrement = () => {
    onIncrement();
  };

  return (
    <div>
      <span>
        {label}: {count}{' '}
      </span>
      <Button onClick={handleIncrement}>øk med en</Button>
    </div>
  );
};
