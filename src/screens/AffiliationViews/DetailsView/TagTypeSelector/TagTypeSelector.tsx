import * as React from 'react';

import RadioButtonGroup from 'aurora-frontend-react-komponenter/RadioButtonGroup';

import { ImageTagType } from 'models/TagsPagedGroup';
import { IVersionStrategyOption } from '.';
import renderTagOption from './renderTagOption';

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

const { AURORA_VERSION, BUGFIX, LATEST, MAJOR, MINOR, SNAPSHOT } = ImageTagType;

const versionStategyOptions: IVersionStrategyOption[] = [
  { key: MAJOR, onRenderLabel: renderTagOption, tag: MAJOR, text: 'Major' },
  { key: MINOR, onRenderLabel: renderTagOption, tag: MINOR, text: 'Minor' },
  { key: BUGFIX, onRenderLabel: renderTagOption, tag: BUGFIX, text: 'Bugfix' },
  { key: LATEST, onRenderLabel: renderTagOption, tag: LATEST, text: 'Latest' },
  {
    key: SNAPSHOT,
    onRenderLabel: renderTagOption,
    tag: SNAPSHOT,
    text: 'Snapshot'
  },
  {
    key: AURORA_VERSION,
    onRenderLabel: renderTagOption,
    tag: AURORA_VERSION,
    text: 'Aurora version'
  }
];

export default TagTypeSelector;
