import * as React from 'react';

import Button from 'aurora-frontend-react-komponenter/Button';

export interface ICounterProps {
  label: string;
  count: number;
  onIncrement: () => any;
  onAdd: (amount: number) => any;
}

export const counter = (props: ICounterProps) => {
  const { label, count, onIncrement, onAdd } = props;

  const handleIncrement = () => {
    onIncrement();
    handleAdd(4);
  };

  const handleAdd = (amount: number) => {
    onAdd(amount);
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
