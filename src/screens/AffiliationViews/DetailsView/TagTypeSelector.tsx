import * as React from 'react';
import styled from 'styled-components';

import RadioButtonGroup from 'aurora-frontend-react-komponenter/RadioButtonGroup';

import { ImageTagType } from 'models/TagsPagedGroup';

const { AURORA_VERSION, BUGFIX, LATEST, MAJOR, MINOR, SNAPSHOT } = ImageTagType;

export interface IVersionStrategyOption {
  key: ImageTagType;
  tag: ImageTagType;
  text: string;
  onRenderLabel?: (options: IVersionStrategyOption) => JSX.Element;
}

function renderTagOption({ tag, text }: IVersionStrategyOption): JSX.Element {
  return <StyledTagOption tag={tag} text={text} />;
}

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

interface IOptionProps {
  tag: ImageTagType;
  text: string;
  className?: string;
}

const TagOption = ({ tag, text, className }: IOptionProps) => (
  <span className={className}>
    <h3>{text}</h3>
    <label>{getOptionLabel(tag)}</label>
  </span>
);

const StyledTagOption = styled(TagOption)`
  position: relative;
  left: 28px;
  margin-bottom: 5px;
  h3 {
    margin: 0;
    margin-bottom: 2px;
  }
`;

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
      return 'Velg spesifikk versjon som alltid skal kjøres.';
  }
}

export default TagTypeSelector;
