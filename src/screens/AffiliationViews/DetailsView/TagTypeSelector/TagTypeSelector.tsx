import * as React from 'react';

import RadioButtonGroup from 'aurora-frontend-react-komponenter/RadioButtonGroup';

import { ImageTagType } from 'services/TagStateManager';
import TagOption from './TagOption';

export interface IImageTagTypeOption {
  key: ImageTagType;
  tag: ImageTagType;
  text: string;
  onRenderLabel?: (options: IImageTagTypeOption) => JSX.Element;
}

interface ITagTypeSelector {
  imageTagType: ImageTagType;
  handleSelectedStrategy: (e: Event, option: IImageTagTypeOption) => void;
}

const TagTypeSelector = ({
  imageTagType,
  handleSelectedStrategy
}: ITagTypeSelector) => (
  <RadioButtonGroup
    defaultSelectedKey={imageTagType}
    options={versionStategyOptions}
    onChange={handleSelectedStrategy}
  />
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
  createOption(ImageTagType.AURORA_VERSION, 'Aurora version')
];

export default TagTypeSelector;
