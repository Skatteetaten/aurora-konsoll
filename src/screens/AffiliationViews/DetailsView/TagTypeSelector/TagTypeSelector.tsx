import * as React from 'react';

import RadioButtonGroup from 'aurora-frontend-react-komponenter/RadioButtonGroup';

import { ImageTagType } from 'services/TagStateManager';
import { IVersionStrategyOption } from '.';
import TagOption from './renderTagOption';

interface ITagTypeSelector {
  imageTagType: ImageTagType;
  handleSelectedStrategy: (e: Event, option: IVersionStrategyOption) => void;
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

const createOption = (
  type: ImageTagType,
  text: string
): IVersionStrategyOption => ({
  key: type,
  onRenderLabel: renderTagOption,
  tag: type,
  text
});

function renderTagOption({ tag, text }: IVersionStrategyOption): JSX.Element {
  return <TagOption tag={tag} text={text} />;
}

const versionStategyOptions: IVersionStrategyOption[] = [
  createOption(ImageTagType.MAJOR, 'Major'),
  createOption(ImageTagType.MINOR, 'Minor'),
  createOption(ImageTagType.BUGFIX, 'Bugfix'),
  createOption(ImageTagType.LATEST, 'Latest'),
  createOption(ImageTagType.SNAPSHOT, 'Snapshot'),
  createOption(ImageTagType.AURORA_VERSION, 'Aurora version')
];

export default TagTypeSelector;
