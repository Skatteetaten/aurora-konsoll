import * as React from 'react';
import styled from 'styled-components';

import { ImageTagType } from 'models/TagsPagedGroup';
import { IVersionStrategyOption } from '.';

const { AURORA_VERSION, BUGFIX, LATEST, MAJOR, MINOR, SNAPSHOT } = ImageTagType;

export default function renderTagOption({
  tag,
  text
}: IVersionStrategyOption): JSX.Element {
  return <StyledTagOption tag={tag} text={text} />;
}

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
