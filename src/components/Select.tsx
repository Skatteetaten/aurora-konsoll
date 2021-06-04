import * as React from 'react';

import ReactSelect from 'react-select';
import { GroupTypeBase, Theme } from 'react-select/src/types';

import {
  RadioButtonGroupProps,
  skeColor,
} from '@skatteetaten/frontend-components';

interface ISelectProps {
  options?: readonly (
    | { label: string; value: string }
    | GroupTypeBase<{ label: string; value: string }>
  )[];
  placeholder: string;
  selectedKey?: string;
  handleChange: RadioButtonGroupProps['onChange'];
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
    textLight: skeColor.black,
  },
});

const Select = ({
  options,
  placeholder,
  selectedKey,
  handleChange,
  isClearable,
  className,
}: ISelectProps) => {
  const getValue = (key?: string) => (key ? { label: key, value: key } : null);

  const noOptionsMessage = () => 'Ingen';

  const onChange = (option: any) => {
    if (handleChange) {
      handleChange(undefined, option);
    }
  };

  return (
    <ReactSelect
      options={options}
      theme={theme}
      placeholder={placeholder}
      isClearable={isClearable}
      noOptionsMessage={noOptionsMessage}
      value={getValue(selectedKey)}
      onChange={onChange}
      className={className}
    />
  );
};

export default Select;
