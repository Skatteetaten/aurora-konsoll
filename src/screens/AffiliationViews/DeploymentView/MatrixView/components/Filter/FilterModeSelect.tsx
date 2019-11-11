import * as React from 'react';
import { IFilterChange } from './Filter';

import ActionButton from '@skatteetaten/frontend-components/ActionButton';
import RadioButtonGroup from '@skatteetaten/frontend-components/RadioButtonGroup';
import TextField from '@skatteetaten/frontend-components/TextField';

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
  setCurrentFilterName: (filterName: string) => void;
  filterOptions: IFilterOption[];
  selectedFilterKey?: string;
  deleteFilter: () => void;
  mode: FilterMode;
  handleFilterChange: (option: IFilterChange) => void;
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
  const handleRadioButtonChange = (e: Event, option: IFilterChange) => {
    handleFilterChange(option);
  };
  const changeMode = (e: Event, option: IModeChange) => {
    setMode(option.key);
  };

  const newFilter = (
    <>
      <h3>Lag filter:</h3>
      <TextField
        style={{ width: '190px' }}
        placeholder={'Navn'}
        onChanged={setCurrentFilterName}
      />
    </>
  );
  const editFilter = (
    <>
      <h3>Lagrede filtre:</h3>
      <div className="saved-filters">
        <RadioButtonGroup
          boxSide={'start'}
          options={filterOptions}
          onChange={handleRadioButtonChange}
          selectedKey={selectedFilterKey}
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
        boxSide={'start'}
        defaultSelectedKey={mode}
        onChange={changeMode}
        options={[
          {
            key: FilterMode.Create,
            text: 'Nytt',
            iconProps: { iconName: 'AddOutline' }
          },
          {
            key: FilterMode.Edit,
            text: 'Rediger',
            iconProps: { iconName: 'Edit' }
          }
        ]}
      />
      {mode === FilterMode.Create ? newFilter : editFilter}
    </>
  );
};

export default FilterModeSelect;
