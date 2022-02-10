import * as React from 'react';
import styled from 'styled-components';

import { ActionButton } from '@skatteetaten/frontend-components/ActionButton';
import { SelectionType } from './Filter';

interface ISelectionButtonsProps {
  type: SelectionType;
  onClear: (type: SelectionType) => void;
  onSelect: (type: SelectionType) => void;
  className?: string;
}

const SelectionButtons = ({
  type,
  onClear,
  onSelect,
  className,
}: ISelectionButtonsProps) => {
  const clear = () => onClear(type);
  const select = () => onSelect(type);

  return (
    <div className={className}>
      <ActionButton
        style={{ fontSize: '12px', height: '30px', marginRight: '10px' }}
        onClick={select}
        icon="Checkmark"
      >
        Velg alle
      </ActionButton>
      <ActionButton
        style={{ fontSize: '12px', height: '30px' }}
        onClick={clear}
        icon="Clear"
      >
        Fjern alle
      </ActionButton>
    </div>
  );
};

const StyledSelectionButtons = styled(SelectionButtons)`
  margin-left: -6px;
`;

export default StyledSelectionButtons;
