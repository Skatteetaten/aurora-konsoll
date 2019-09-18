import * as React from 'react';

import ComboBox from 'aurora-frontend-react-komponenter/ComboBox';

import { IComboBoxOption } from 'office-ui-fabric-react/lib/index';

import { ImageTagType, findImageTagTypeName } from 'models/ImageTagType';
import styled from 'styled-components';
import { ITagsPagedGroup, ITagsPaged } from 'models/Tag';

const {
  AURORA_VERSION,
  AURORA_SNAPSHOT_VERSION,
  COMMIT_HASH,
  BUGFIX,
  LATEST,
  MAJOR,
  MINOR,
  SNAPSHOT
} = ImageTagType;

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

export function getOptionName(type: ImageTagType): string {
  switch (type) {
    case ImageTagType.AURORA_VERSION:
      return 'Aurora Version';
    case ImageTagType.AURORA_SNAPSHOT_VERSION:
      return 'Unik snapshot version';
    case ImageTagType.BUGFIX:
      return 'Bugfix';
    case ImageTagType.LATEST:
      return 'Latest';
    case ImageTagType.MAJOR:
      return 'Major';
    case ImageTagType.MINOR:
      return 'Minor';
    case ImageTagType.SNAPSHOT:
      return 'Snapshot';
    case ImageTagType.COMMIT_HASH:
      return 'Commit hash';
    default:
      return '';
  }
}

function getOptionLabel(imageTagType: ImageTagType): string {
  switch (imageTagType) {
    case MAJOR:
      return 'Deploy ved os og java-patcher.';
    case MINOR:
      return 'Deploy ved applikasjonsspesifikke patcher.';
    case BUGFIX:
      return 'Deploy ved ny bakoverkompatibel funksjonalitet.';
    case LATEST:
      return 'Deploy ved nyeste versjon.';
    case SNAPSHOT:
      return 'Deploy ved nytt snapshot-bygg.';
    case AURORA_VERSION:
      return 'Deploy spesifikk versjon som alltid skal kjøres.';
    case AURORA_SNAPSHOT_VERSION:
      return 'Deploy spesifikk snapshot versjon som alltid skal kjøres.';
    case COMMIT_HASH:
      return 'Deploy commit hash.';
    default:
      return '';
  }
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

  function groupedTagsTotalCount(type: ImageTagType): number | undefined {
    const imageTagTypeName = findImageTagTypeName(type);
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

  function createOption(type: ImageTagType): IImageTagTypeOption {
    return {
      key: type,
      tag: type,
      text: `(${groupedTagsTotalCount(type)}) ${getOptionName(
        type
      )} - ${getOptionLabel(type)}`
    };
  }

  const versionStategyOptions: IImageTagTypeOption[] = [
    createOption(ImageTagType.MAJOR),
    createOption(ImageTagType.MINOR),
    createOption(ImageTagType.BUGFIX),
    createOption(ImageTagType.LATEST),
    createOption(ImageTagType.SNAPSHOT),
    createOption(ImageTagType.AURORA_SNAPSHOT_VERSION),
    createOption(ImageTagType.COMMIT_HASH),
    createOption(ImageTagType.AURORA_VERSION)
  ];
  return (
    <div className={className}>
      <RadioButtonWrapper>
        <div className="comboBox">
          <ComboBox
            options={versionStategyOptions}
            selectedKey={imageTagType}
            onChange={onTagTypeChanged}
            label="Velg versjonstype"
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
