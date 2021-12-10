import React, { FormEvent } from 'react';
import styled from 'styled-components';
import { ComboBox } from '@skatteetaten/frontend-components';

import { ImageTagType } from 'web/models/ImageTagType';

import { getVersionTypeSelectorOptions } from './utils/options';
import { onRenderOption } from './components/VersionTypeOption';
import { VersionTypeSelectorState } from './VersionTypeSelector.state';
import { IComboBox, IComboBoxOption } from '@fluentui/react';

interface IVersionTypeSelectorProps {
  onSelect: (type: ImageTagType) => void;
  versionType: ImageTagType;
  className?: string;
}

type Props = IVersionTypeSelectorProps & VersionTypeSelectorState;

export const VersionTypeSelector = ({
  totalCountMap,
  onSelect,
  versionType,
  className,
  clearStateForType,
}: Props) => {
  const onTagTypeChanged = (
    event: FormEvent<IComboBox>,
    option?: IComboBoxOption
  ) => {
    clearStateForType(ImageTagType.SEARCH);
    if (option) {
      onSelect(option.key as ImageTagType);
    }
  };

  return (
    <div className={className}>
      <Wrapper>
        <div className="comboBox">
          <ComboBox
            options={getVersionTypeSelectorOptions(totalCountMap)}
            selectedKey={versionType}
            onChange={onTagTypeChanged}
            label="Velg versjontype"
            onRenderOption={onRenderOption}
          />
        </div>
      </Wrapper>
    </div>
  );
};

const Wrapper = styled.div`
  .ms-ChoiceField-wrapper {
    width: 100%;
  }
  .ms-ChoiceField-field {
    width: 100%;
  }
  .ms-Button-flexContainer {
    span {
      margin: 0;
    }
  }
  .ms-ComboBox-Input,
  .ms-ComboBox {
    height: 32px;
    cursor: pointer;
  }
  .comboBox {
    min-width: 500px;
    input {
      font-weight: bold;
    }
  }
`;
