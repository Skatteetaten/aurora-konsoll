export enum ImageTagType {
  AURORA_VERSION = 'AURORA_VERSION',
  AURORA_SNAPSHOT_VERSION = 'AURORA_SNAPSHOT_VERSION',
  BUGFIX = 'BUGFIX',
  LATEST = 'LATEST',
  MAJOR = 'MAJOR',
  MINOR = 'MINOR',
  SNAPSHOT = 'SNAPSHOT',
  COMMIT_HASH = 'COMMIT_HASH'
}

interface IImageTagTypeNameAndLabel {
  name: string;
  label: string;
}

export function findImageTagTypeNameAndLabel(
  type: ImageTagType
): IImageTagTypeNameAndLabel {
  switch (type) {
    case ImageTagType.AURORA_VERSION:
      return { name: 'auroraVersion', label: 'Aurora Version' };
    case ImageTagType.AURORA_SNAPSHOT_VERSION:
      return { name: 'auroraSnapshotVersion', label: 'Unik snapshot version' };
    case ImageTagType.BUGFIX:
      return { name: 'bugfix', label: 'Bugfix' };
    case ImageTagType.LATEST:
      return { name: 'latest', label: 'Latest' };
    case ImageTagType.MAJOR:
      return { name: 'major', label: 'Major' };
    case ImageTagType.MINOR:
      return { name: 'minor', label: 'Minor' };
    case ImageTagType.SNAPSHOT:
      return { name: 'snapshot', label: 'Snapshot' };
    case ImageTagType.COMMIT_HASH:
      return { name: 'commitHash', label: 'Commit hash' };
    default:
      return { name: '', label: '' };
  }
}
