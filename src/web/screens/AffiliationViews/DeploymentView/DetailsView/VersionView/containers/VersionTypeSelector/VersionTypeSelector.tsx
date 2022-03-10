import React, { FormEvent } from 'react';
import styled from 'styled-components';
import { ComboBox } from '@skatteetaten/frontend-components/ComboBox';

import { ImageTagType } from 'web/models/ImageTagType';

import { getVersionTypeSelectorOptions } from './utils/options';
import { onRenderOption } from './components/VersionTypeOption';
import { IComboBox, IComboBoxOption } from '@fluentui/react';
import {TotalCountMap} from "./VersionTypeSelector.types";

interface IVersionTypeSelectorProps {
  onSelect: (type: ImageTagType) => void;
  versionType: ImageTagType;
  className?: string;
  totalCountMap: TotalCountMap
}

type Props = IVersionTypeSelectorProps;

export const VersionTypeSelector = ({
  totalCountMap,
  onSelect,
  versionType,
  className
}: Props) => {
  const onTagTypeChanged = (
    event: FormEvent<IComboBox>,
    option?: IComboBoxOption
  ) => {
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
            label="Velg versjonstype"
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
