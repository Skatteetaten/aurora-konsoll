import { ImageTagType } from 'web/models/ImageTagType';
import { TotalCountMap } from '../../../../../../../../models/VersionTypeSelector.types';

export interface IImageTagTypeOption {
  key: ImageTagType;
  tag: ImageTagType;
  text: string;
}

const {
  SEARCH,
  AURORA_VERSION,
  AURORA_SNAPSHOT_VERSION,
  COMMIT_HASH,
  BUGFIX,
  LATEST,
  MAJOR,
  MINOR,
  SNAPSHOT,
} = ImageTagType;

function getOptionLabel(imageTagType: ImageTagType): string {
  switch (imageTagType) {
    case MAJOR:
      return 'Major - Deploy ved os og java-patcher.';
    case MINOR:
      return 'Minor - Deploy ved applikasjonsspesifikke patcher.';
    case BUGFIX:
      return 'Bugfix - Deploy ved ny bakoverkompatibel funksjonalitet.';
    case LATEST:
      return 'Latest - Deploy ved nyeste versjon.';
    case SNAPSHOT:
      return 'Snapshot - Deploy ved nytt snapshot-bygg.';
    case AURORA_VERSION:
      return 'Aurora version - Deploy spesifikk versjon som alltid skal kjøres.';
    case AURORA_SNAPSHOT_VERSION:
      return 'Unik snapshot version - Deploy spesifikk snapshot versjon som alltid skal kjøres.';
    case COMMIT_HASH:
      return 'Commit hash - Deploy commit hash.';
    default:
      return '';
  }
}

export function getVersionTypeSelectorOptions(
  totalCountMap: TotalCountMap
): IImageTagTypeOption[] {
  const createOption = (type: ImageTagType): IImageTagTypeOption => {
    const text = `(${totalCountMap[type]}) ${getOptionLabel(type)}`;
    return {
      key: type,
      tag: type,
      text: type === SEARCH ? '' : text,
    };
  };

  return [
    createOption(MAJOR),
    createOption(MINOR),
    createOption(BUGFIX),
    createOption(LATEST),
    createOption(SNAPSHOT),
    createOption(AURORA_SNAPSHOT_VERSION),
    createOption(COMMIT_HASH),
    createOption(AURORA_VERSION),
  ];
}
