import { IPodResource } from 'models/Pod';

export enum VersionStatus {
  OK,
  IS_NOT_LATEST,
  DIFFER_FROM_AURORA_CONFIG,
  IS_NOT_LATEST_AND_DIFFER_FROM_AURORA_CONFIG
}

export function getVersionStatus(
  pods: IPodResource[],
  activeVersion: string,
  configuredVersion?: string,
  releaseToVersion?: string,
  deploymentInProgress?: boolean
): VersionStatus {
  const isLatestAvailableVersion = areAnyPodsRunningWithLatestVersion(pods);
  const isActiveVersionSameAsConfigured =
    configuredVersion === activeVersion || releaseToVersion === activeVersion;

  if (deploymentInProgress) {
    return VersionStatus.OK;
  }

  if (!isLatestAvailableVersion && !isActiveVersionSameAsConfigured) {
    return VersionStatus.IS_NOT_LATEST_AND_DIFFER_FROM_AURORA_CONFIG;
  } else if (!isActiveVersionSameAsConfigured) {
    return VersionStatus.DIFFER_FROM_AURORA_CONFIG;
  } else if (!isLatestAvailableVersion) {
    return VersionStatus.IS_NOT_LATEST;
  } else {
    return VersionStatus.OK;
  }
}

export const versionStatusMessage = (versionStatus: VersionStatus): string => {
  const bulletPoint = '\u2022';
  const newerImageAvailable = `Det finnes et nyere image for denne taggen tilgjengelig på Docker Registry.`;
  const differentVersions = `Aktivt deploy sin tag stemmer ikke overens med Aurora Config. Deploy på nytt.`;
  switch (versionStatus) {
    case VersionStatus.IS_NOT_LATEST_AND_DIFFER_FROM_AURORA_CONFIG: {
      return `${newerImageAvailable}\n${bulletPoint} ${differentVersions}`;
    }
    case VersionStatus.DIFFER_FROM_AURORA_CONFIG: {
      return differentVersions;
    }
    case VersionStatus.IS_NOT_LATEST: {
      return newerImageAvailable;
    }
    case VersionStatus.OK: {
      return '';
    }
  }
};

function areAnyPodsRunningWithLatestVersion(pods: IPodResource[]): boolean {
  return pods.reduce((a: boolean, pod: IPodResource) => {
    return a || (pod.phase === 'Running' && pod.latestDeployTag);
  }, false);
}
