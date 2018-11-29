import * as React from 'react';
import styled from 'styled-components';

import ReactSelect from 'react-select';
import { Theme } from 'react-select/lib/types';

import palette from 'aurora-frontend-react-komponenter/utils/palette';

const { skeColor } = palette;
interface ISelectProps {
  options: Array<{
    value: string | undefined;
    label: string | undefined;
  }>;
  placeholder: string;
  noOptionsMessage: () => string;
  selectedFilterKey?: string;
  handleFilterChange: (option: any) => void;
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
  noOptionsMessage,
  selectedFilterKey,
  handleFilterChange
}: ISelectProps) => {
  // const selected = {
  //   label: selectedFilterKey,
  //   value: selectedFilterKey
  // };

  return (
    <StyledSelect>
      <ReactSelect
        options={options}
        theme={theme}
        placeholder={placeholder}
        isClearable={true}
        noOptionsMessage={noOptionsMessage}
        onChange={handleFilterChange}
      />
    </StyledSelect>
  );
};

const StyledSelect = styled.div`
  z-index: 1000;
  width: 250px;
`;

export default Select;
