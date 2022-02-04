import * as React from 'react';

import Tooltip from 'web/components/IconWithTooltip';
import { VersionStatus, versionStatusMessage } from '../models/VersionStatus';
import { SkeBasis } from '@skatteetaten/frontend-components/SkeBasis';

const { skeColor } = SkeBasis.PALETTE;
const bulletPoint = '\u2022';

interface IDifferentVersionTooltipProps {
  deploymentTag: string;
  versionStatus: VersionStatus;
}

export const DifferentVersionTooltip = ({
  versionStatus,
  deploymentTag,
}: IDifferentVersionTooltipProps) => {
  if (versionStatus === VersionStatus.OK) {
    return deploymentTag;
  }

  const message = versionStatusMessage(versionStatus);

  return (
    <>
      <Tooltip
        content={`Dette deployet kjører ikke ønsket versjon.\n${bulletPoint} ${message}`}
        icon="Info"
        iconStyle={{
          cursor: 'default',
          color: skeColor.error,
          fontSize: '18px',
        }}
      />
      <div style={{ paddingLeft: '25px' }} title={deploymentTag}>
        {deploymentTag}
      </div>
    </>
  );
};
