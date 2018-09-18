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

interface IOptionProps {
  className?: string;
}

const Option = ({
  tag,
  text,
  className
}: IOptionProps & IVersionStrategyOption) => (
  <span className={className}>
    <h3>{text}</h3>
    <label>{getOptionLabel(tag)}</label>
  </span>
);

const StyledOption = styled(Option)`
  position: relative;
  left: 28px;
  h3 {
    margin: 0;
  }
`;

function renderOptionText(option: IVersionStrategyOption): JSX.Element {
  return <StyledOption {...option} />;
}

const versionStategyOptions: IVersionStrategyOption[] = [
  { key: MAJOR, onRenderLabel: renderOptionText, tag: MAJOR, text: 'Major' },
  { key: MINOR, onRenderLabel: renderOptionText, tag: MINOR, text: 'Minor' },
  { key: BUGFIX, onRenderLabel: renderOptionText, tag: BUGFIX, text: 'Bugfix' },
  { key: LATEST, onRenderLabel: renderOptionText, tag: LATEST, text: 'Latest' },
  {
    key: SNAPSHOT,
    onRenderLabel: renderOptionText,
    tag: SNAPSHOT,
    text: 'Snapshot'
  },
  {
    key: AURORA_VERSION,
    onRenderLabel: renderOptionText,
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

export default TagTypeSelector;
