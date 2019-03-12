import * as React from 'react';

import RadioButtonGroup from 'aurora-frontend-react-komponenter/RadioButtonGroup';

import { ImageTagType } from 'models/ImageTagType';
import styled from 'styled-components';
import TagOption from './TagOption';

export interface IImageTagTypeOption {
  key: ImageTagType;
  tag: ImageTagType;
  text: string;
  onRenderLabel?: (options: IImageTagTypeOption) => JSX.Element;
}

interface ITagTypeSelector {
  imageTagType: ImageTagType;
  handleSelectStrategy: (e: Event, option: IImageTagTypeOption) => void;
}

const TagTypeSelector = ({
  imageTagType,
  handleSelectStrategy
}: ITagTypeSelector) => (
  <RadioButtonWrapper>
    <RadioButtonGroup
      selectedKey={imageTagType}
      options={versionStategyOptions}
      onChange={handleSelectStrategy}
    />
  </RadioButtonWrapper>
);

function createOption(type: ImageTagType, text: string): IImageTagTypeOption {
  return {
    key: type,
    onRenderLabel: renderTagOption,
    tag: type,
    text
  };
}

function renderTagOption({ tag, text }: IImageTagTypeOption): JSX.Element {
  return <TagOption tag={tag} text={text} />;
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

const RadioButtonWrapper = styled.div`
  .ms-ChoiceField-wrapper {
    width: 100%;
  }
  .ms-ChoiceField-field {
    width: 100%;
  }
`;

export default TagTypeSelector;
