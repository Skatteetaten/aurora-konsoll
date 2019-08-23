import * as React from 'react';

import ComboBox from 'aurora-frontend-react-komponenter/ComboBox';

import { IComboBoxOption } from 'office-ui-fabric-react/lib/index';

import { ImageTagType, findImageTagTypeName } from 'models/ImageTagType';
import styled from 'styled-components';
import { getOptionLabel } from './TagOption';
import { ITagsPagedGroup, ITagsPaged } from 'models/Tag';

export interface IImageTagTypeOption {
  key: ImageTagType;
  tag: ImageTagType;
  text: string;
}

interface ITagTypeSelector {
  imageTagType: ImageTagType;
  handleSelectStrategy: (e: Event, option: IImageTagTypeOption) => void;
  findGroupedTagsPagedResult: ITagsPagedGroup;
  className?: string;
}

const TagTypeSelector = ({
  imageTagType,
  handleSelectStrategy,
  findGroupedTagsPagedResult,
  className
}: ITagTypeSelector) => {
  const onTagTypeChanged = (e: Event, option: IImageTagTypeOption) => {
    handleSelectStrategy(e, option);
  };

  function groupedTagsTotalCount(type: ImageTagType) {
    const imageTagTypeName = findImageTagTypeName(type);
    if (findGroupedTagsPagedResult.auroraSnapshotVersion.totalCount > 0) {
      const tagsCount = Object.entries(findGroupedTagsPagedResult).reduce(
        (acc, k: [string, ITagsPaged]) => {
          if (k[0] === imageTagTypeName) {
            return acc + k[1].totalCount;
          } else {
            return acc;
          }
        },
        0
      );
      return tagsCount;
    }
  }

  function createOption(type: ImageTagType, text: string): IImageTagTypeOption {
    return {
      key: type,
      tag: type,
      text: `(${groupedTagsTotalCount(type)}) ${text} - ${getOptionLabel(type)}`
    };
  }

  const versionStategyOptions: IImageTagTypeOption[] = [
    createOption(ImageTagType.MAJOR, 'Major'),
    createOption(ImageTagType.MINOR, 'Minor'),
    createOption(ImageTagType.BUGFIX, 'Bugfix'),
    createOption(ImageTagType.LATEST, 'Latest'),
    createOption(ImageTagType.SNAPSHOT, 'Snapshot'),
    createOption(ImageTagType.AURORA_SNAPSHOT_VERSION, 'Unik snapshot version'),
    createOption(ImageTagType.COMMIT_HASH, 'Commit hash'),
    createOption(ImageTagType.AURORA_VERSION, 'Aurora version')
  ];
  return (
    <div className={className}>
      <RadioButtonWrapper>
        <div className="comboBox">
          <ComboBox
            options={versionStategyOptions}
            selectedKey={imageTagType}
            onChange={onTagTypeChanged}
            label="Velg type deploy"
            info="Her vises de forskjellige deploy kategroiene og antall tags for finnes for hver av dem"
            onRenderOption={onRenderOption}
          />
        </div>
      </RadioButtonWrapper>
    </div>
  );
};

const onRenderOption = (item: IComboBoxOption): JSX.Element => {
  const option = item.text;
  return (
    <StyledOptions>
      <div className="bold-options">{option.split('-').slice(0, 1)}</div>
      {option.split(/(?=-)/g).slice(1, 2)}
    </StyledOptions>
  );
};

const StyledOptions = styled.div`
  display: inline-flex;
  white-space: pre-wrap;
  margin: 10px 0 10px 0;
  .bold-options {
    font-weight: bold;
  }
`;

const RadioButtonWrapper = styled.div`
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

export default TagTypeSelector;
