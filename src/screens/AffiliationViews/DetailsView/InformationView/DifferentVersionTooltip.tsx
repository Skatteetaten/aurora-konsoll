import * as React from 'react';

import palette from 'aurora-frontend-react-komponenter/utils/palette';

import Tooltip from 'components/IconWithTooltip';
import { IDeploymentSpec } from 'models/DeploymentSpec';
import { IPodResource } from 'models/Pod';

const { skeColor } = palette;
const bulletPoint = '\u2022';

interface IDifferentVersionTooltipProps {
  deploymentTag: string;
  deploymentSpec?: IDeploymentSpec;
  pods: IPodResource[];
}

export const DifferentVersionTooltip = ({
  deploymentSpec,
  deploymentTag,
  pods
}: IDifferentVersionTooltipProps) => {
  const isLatestDeployTag = areAnyPodsRunningWithLatestDeployTag(pods);
  const isCorrectDeploytag = isActiveTagSameAsAuroraConfigTag(
    deploymentTag,
    deploymentSpec
  );

  const message = warningMessage(isLatestDeployTag, isCorrectDeploytag);

  if ((isLatestDeployTag && isCorrectDeploytag) || pods.length === 0) {
    return deploymentTag;
  }

  return (
    <>
      <Tooltip
        content={`Dette deployet kjører ikke ønsket versjon.\n${bulletPoint} ${message}`}
        icon="Info"
        iconStyle={{
          cursor: 'default',
          color: skeColor.error,
          fontSize: '18px'
        }}
      />
      <div style={{ paddingLeft: '25px' }} title={deploymentTag}>
        {deploymentTag}
      </div>
    </>
  );
};

function areAnyPodsRunningWithLatestDeployTag(pods: IPodResource[]): boolean {
  return pods.reduce(
    (a: boolean, pod: IPodResource) => a || (pod.phase === 'Running' && pod.latestDeployTag),
    false
  );
}

function isActiveTagSameAsAuroraConfigTag(
  deploymentTag: string,
  deploymentSpec?: IDeploymentSpec
): boolean {
  if (!deploymentSpec) {
    return false;
  }

  return (
    deploymentSpec.version === deploymentTag ||
    deploymentSpec.releaseTo === deploymentTag
  );
}

const warningMessage = (
  isLatestDeployTag: boolean,
  isCorrectDeployTag: boolean
): string => {
  const newerImageAvailable = `Det finnes et nyere image for denne taggen tilgjengelig på Docker Registry.`;
  const differentVersions = `Aktivt deploy sin tag stemmer ikke overens med Aurora Config. Deploy på nytt.`;
  if (!isLatestDeployTag && !isCorrectDeployTag) {
    return `${newerImageAvailable}\n${bulletPoint} ${differentVersions}`;
  } else if (isLatestDeployTag && !isCorrectDeployTag) {
    return differentVersions;
  } else if (!isLatestDeployTag && isCorrectDeployTag) {
    return newerImageAvailable;
  } else {
    return '';
  }
};
