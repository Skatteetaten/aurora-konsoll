import { ImageTagType } from 'models/ImageTagType';
import * as React from 'react';
import styled from 'styled-components';

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

interface IOptionProps {
  tag: ImageTagType;
  text: string;
  className?: string;
}

const TagOption = ({ tag, text, className }: IOptionProps) => (
  <span className={className}>
    <h3>{text}</h3>
    <p>{getOptionLabel(tag)}</p>
  </span>
);

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
  }
}

export default styled(TagOption)`
  position: relative;
  left: 28px;
  h3 {
    margin: 0;
    margin-bottom: 2px;
  }

  p {
    margin: 0;
  }
`;
