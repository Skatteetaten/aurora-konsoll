export enum ImageTagType {
  AURORA_VERSION = 'AURORA_VERSION',
  BUGFIX = 'BUGFIX',
  LATEST = 'LATEST',
  MAJOR = 'MAJOR',
  MINOR = 'MINOR',
  SNAPSHOT = 'SNAPSHOT'
}

export function findImageTagTypeName(type: ImageTagType): string {
  switch (type) {
    case ImageTagType.AURORA_VERSION:
      return 'auroraVersion';
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
  }
}
