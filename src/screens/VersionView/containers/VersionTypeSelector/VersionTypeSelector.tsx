import React from 'react';
import styled from 'styled-components';
import ComboBox from 'aurora-frontend-react-komponenter/ComboBox';

import { ImageTagType } from 'models/ImageTagType';
import {
  IImageTagTypeOption,
  TotalCountMap
} from './VersionTypeSelector.types';
import { getVersionTypeSelectorOptions } from './Options';
import { onRenderOption } from './VersionTypeOption';

interface IVersionTypeSelectorProps {
  totalCountMap: TotalCountMap;
  onSelect: (type: ImageTagType) => void;
  versionType: ImageTagType;
  className?: string;
}

export const VersionTypeSelector = ({
  totalCountMap,
  onSelect,
  versionType,
  className
}: IVersionTypeSelectorProps) => {
  const onTagTypeChanged = (e: Event, option: IImageTagTypeOption) => {
    onSelect(option.key);
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
    cursor: pointer;
  }
  .comboBox {
    min-width: 500px;
    input {
      font-weight: bold;
    }
  }
`;
