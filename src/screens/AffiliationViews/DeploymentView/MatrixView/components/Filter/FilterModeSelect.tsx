import * as React from 'react';

import ActionButton from '@skatteetaten/frontend-components/ActionButton';
import RadioButtonGroup, {
  RadioButtonGroupProps
} from '@skatteetaten/frontend-components/RadioButtonGroup';
import TextField from '@skatteetaten/frontend-components/TextField';
import { TextFieldEvent } from 'types/react';

export enum FilterMode {
  Create,
  Edit
}

export interface IFilterOption {
  value: string | undefined;
  label: string | undefined;
  key: string | undefined;
  text: string | undefined;
}

interface IFilterModeSelectProps {
  setMode: (mode: FilterMode) => void;
  setCurrentFilterName: (event: TextFieldEvent, newValue?: string) => void;
  filterOptions: RadioButtonGroupProps['options'];
  selectedFilterKey?: string;
  deleteFilter: () => void;
  mode: FilterMode;
  handleFilterChange: RadioButtonGroupProps['onChange'];
}

interface IModeChange {
  key: FilterMode;
  text: string;
}

const FilterModeSelect = ({
  setMode,
  setCurrentFilterName,
  filterOptions,
  selectedFilterKey,
  deleteFilter,
  mode,
  handleFilterChange
}: IFilterModeSelectProps) => {
  const changeMode: RadioButtonGroupProps['onChange'] = (ev, option) => {
    if (option) {
      setMode(Number(option.key) as FilterMode);
    }
  };

  const newFilter = (
    <>
      <h3>Lag filter:</h3>
      <TextField
        style={{ width: '190px' }}
        placeholder={'Navn'}
        onChange={setCurrentFilterName}
      />
    </>
  );
  const editFilter = (
    <>
      <h3>Lagrede filtre:</h3>
      <div className="saved-filters">
        <RadioButtonGroup
          options={filterOptions}
          onChange={handleFilterChange}
          selectedKey={selectedFilterKey}
          warning=""
          errorMessage=""
        />
      </div>
      <ActionButton color="red" icon="Delete" onClick={deleteFilter}>
        Slett filter
      </ActionButton>
    </>
  );
  return (
    <>
      <RadioButtonGroup
        defaultSelectedKey={mode.toString()}
        onChange={changeMode}
        options={[
          {
            key: FilterMode.Create.toString(),
            text: 'Nytt',
            iconProps: { iconName: 'AddOutline' }
          },
          {
            key: FilterMode.Edit.toString(),
            text: 'Rediger',
            iconProps: { iconName: 'Edit' }
          }
        ]}
        warning=""
        errorMessage=""
      />
      {mode === FilterMode.Create ? newFilter : editFilter}
    </>
  );
};

export default FilterModeSelect;
