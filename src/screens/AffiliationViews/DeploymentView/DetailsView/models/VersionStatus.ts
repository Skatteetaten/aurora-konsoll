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
  const isLatestDeployTag = areAnyPodsRunningWithLatestDeployTag(pods);
  const isCorrectDeploytag = isActiveTagSameAsAuroraConfigTag(
    activeVersion,
    configuredVersion,
    releaseToVersion
  );

  if (deploymentInProgress) {
    return VersionStatus.OK;
  }

  if (!isLatestDeployTag && !isCorrectDeploytag) {
    return VersionStatus.IS_NOT_LATEST_AND_DIFFER_FROM_AURORA_CONFIG;
  } else if (!isCorrectDeploytag) {
    return VersionStatus.DIFFER_FROM_AURORA_CONFIG;
  } else if (!isLatestDeployTag) {
    return VersionStatus.IS_NOT_LATEST;
  } else {
    return VersionStatus.OK;
  }
}

function areAnyPodsRunningWithLatestDeployTag(pods: IPodResource[]): boolean {
  return pods.reduce((a: boolean, pod: IPodResource) => {
    return a || (pod.phase === 'Running' && pod.latestDeployTag);
  }, false);
}

function isActiveTagSameAsAuroraConfigTag(
  activeVersion: string,
  configuredVersion?: string,
  releaseToVersion?: string
): boolean {
  return (
    configuredVersion === activeVersion || releaseToVersion === activeVersion
  );
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
