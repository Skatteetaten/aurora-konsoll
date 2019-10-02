export enum ImageTagType {
  AURORA_VERSION = 'AURORA_VERSION',
  AURORA_SNAPSHOT_VERSION = 'AURORA_SNAPSHOT_VERSION',
  BUGFIX = 'BUGFIX',
  LATEST = 'LATEST',
  MAJOR = 'MAJOR',
  MINOR = 'MINOR',
  SNAPSHOT = 'SNAPSHOT',
  COMMIT_HASH = 'COMMIT_HASH',
  SEARCH = 'SEARCH'
}

export function findImageTagTypeName(type: ImageTagType): string {
  switch (type) {
    case ImageTagType.AURORA_VERSION:
      return 'auroraVersion';
    case ImageTagType.AURORA_SNAPSHOT_VERSION:
      return 'auroraSnapshotVersion';
    case ImageTagType.BUGFIX:
      return 'bugfix';
    case ImageTagType.LATEST:
      return 'latest';
    case ImageTagType.MAJOR:
      return 'major';
    case ImageTagType.MINOR:
      return 'minor';
    case ImageTagType.SNAPSHOT:
      return 'snapshot';
    case ImageTagType.COMMIT_HASH:
      return 'commitHash';
    case ImageTagType.SEARCH:
      return 'search';
  }
}
