import * as React from 'react';
import { IFilterChange } from './Filter';

import ActionButton from 'aurora-frontend-react-komponenter/ActionButton';
import RadioButtonGroup from 'aurora-frontend-react-komponenter/RadioButtonGroup';
import TextField from 'aurora-frontend-react-komponenter/TextField';

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
  setCurrentFilterName: (filterName: string) => void;
  filterOptions: IFilterOption[];
  selectedFilterKey?: string;
  deleteFilter: () => void;
  mode: FilterMode;
  handleFilterChange: (option: IFilterChange) => void;
}

const FilterModeSelect = ({
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
  return mode === FilterMode.Create ? newFilter : editFilter;
};

export default FilterModeSelect;
