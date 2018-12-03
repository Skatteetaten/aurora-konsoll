import * as React from 'react';
import styled from 'styled-components';

import ReactSelect from 'react-select';
import { Theme } from 'react-select/lib/types';

import palette from 'aurora-frontend-react-komponenter/utils/palette';

const { skeColor } = palette;

export interface ISelectLabel {
  label?: string;
}

interface ISelectProps {
  options: Array<{
    value: string | undefined;
    label: string | undefined;
  }>;
  placeholder: string;
  selectedKey?: ISelectLabel;
  handleChange: (option: any) => void;
  isClearable: boolean;
}

const theme = (t: Theme) => ({
  ...t,
  borderRadius: 0,
  colors: {
    ...t.colors,
    primary25: skeColor.whiteGrey,
    primary: skeColor.lightGrey,
    textLight: skeColor.black
  }
});

const Select = ({
  options,
  placeholder,
  selectedKey,
  handleChange,
  isClearable
}: ISelectProps) => {
  const getValue = (key?: ISelectLabel) => 
  (key) ? { label: key.label, value: key.label } : undefined

  const noOptionsMessage = () => 'Ingen';

  return (
    <StyledSelect>
      <ReactSelect
        options={options}
        theme={theme}
        placeholder={placeholder}
        isClearable={isClearable}
        noOptionsMessage={noOptionsMessage}
        value={getValue(selectedKey)}
        onChange={handleChange}
      />
    </StyledSelect>
  );
};

const StyledSelect = styled.div`
  z-index: 1000;
  width: 250px;
`;

export default Select;
