import * as React from 'react';

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
  selectedKey?: string;
  handleChange: (option: any) => void;
  isClearable: boolean;
  className: string;
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
  isClearable,
  className
}: ISelectProps) => {
  const getValue = (key?: string) => (key ? { label: key, value: key } : null);

  const noOptionsMessage = () => 'Ingen';

  return (
    <ReactSelect
      options={options}
      theme={theme}
      placeholder={placeholder}
      isClearable={isClearable}
      noOptionsMessage={noOptionsMessage}
      value={getValue(selectedKey)}
      onChange={handleChange}
      className={className}
    />
  );
};

export default Select;
