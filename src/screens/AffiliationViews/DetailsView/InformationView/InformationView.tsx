import * as React from 'react';
import styled from 'styled-components';

import palette from 'aurora-frontend-react-komponenter/utils/palette';
import Tooltip from 'components/IconWithTooltip';
import InfoContent from 'components/InfoContent';
import Spinner from 'components/Spinner';
import {
  IApplicationDeployment,
  IApplicationDeploymentDetails
} from 'models/ApplicationDeployment';
import { IDeploymentSpec } from 'models/DeploymentSpec';
import PodStatus from './PodStatus';
import StatusCheckReportCard from './StatusCheckReportCard';

const { skeColor } = palette;
const bulletPoint = '\u2022';

interface IInformationViewProps {
  isFetchingDetails: boolean;
  deploymentDetails: IApplicationDeploymentDetails;
  deployment: IApplicationDeployment;
  className?: string;
  isUpdating: boolean;
  refreshApplicationDeployment: () => void;
}

const InformationView = ({
  isFetchingDetails,
  deploymentDetails,
  deployment,
  className,
  isUpdating,
  refreshApplicationDeployment
}: IInformationViewProps) => {
  const { deploymentSpec, pods } = deploymentDetails;
  if (isFetchingDetails) {
    return <Spinner />;
  }
  const isLatestDeployTag = AreAnyPodsRunningWithLatestDeployTag(
    deploymentDetails
  );
  const isCorrectDeploytag = isActiveTagSameAsAuroraConfigTag(
    deploymentSpec,
    deployment
  );
  const message = warningMessage(isLatestDeployTag, isCorrectDeploytag);

  const deployTagName = deployment.version.deployTag.name;

  const renderTooltipWhenHavingPods = () => {
    if (pods.length > 0) {
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
          <div className="styledDeployTag" title={deployTagName}>
            {deployTagName}
          </div>
        </>
      );
    } else {
      return deployTagName;
    }
  };

  const TagWithWarningMessage =
    !isLatestDeployTag || !isCorrectDeploytag
      ? renderTooltipWhenHavingPods()
      : deployTagName;
  return (
    <div className={className}>
      <div className="info-grid">
        <div>
          <h3>Aktivt deployment</h3>
          <InfoContent
            id="active-deployment"
            values={getApplicationDeploymentValues(
              deployment,
              TagWithWarningMessage
            )}
          />
          <h3>Gjeldende AuroraConfig</h3>
          <InfoContent values={getDeploymentSpecValues(deploymentSpec)} />
        </div>
        <div>
          <h3>AuroraStatus for deployment</h3>
          <StatusCheckReportCard deployment={deployment} />
        </div>
      </div>
      <hr
        style={{
          borderWidth: '2px',
          margin: '30px 0'
        }}
      />
      <h3>Pods fra OpenShift</h3>
      <div className="info-deployments">
        {pods.map(pod => (
          <PodStatus
            key={pod.name}
            pod={pod}
            className="info-pod"
            isUpdating={isUpdating}
            refreshApplicationDeployment={refreshApplicationDeployment}
          />
        ))}
      </div>
    </div>
  );
};

function getDeploymentSpecValues(deploymentSpec?: IDeploymentSpec) {
  let values: { [key: string]: any } = {};
  if (deploymentSpec) {
    const { database, management, certificate, type } = deploymentSpec;
    values = {
      Type: type
    };
    if (['development', 'deploy'].indexOf(type) !== -1) {
      values.GroupId = deploymentSpec.groupId;
      values.ArtifactId = deploymentSpec.artifactId;
    }
    values.Version = deploymentSpec.version;
    if (deploymentSpec.releaseTo) {
      values.ReleaseTo = deploymentSpec.releaseTo;
    }
    if (database) {
      values.Database = 'Ja';
    }
    if (certificate) {
      values.Certificate = 'Ja';
    }
    if (management) {
      values.Management = `Path: ${management.path} | Port: ${management.port}`;
    }
  }
  return values;
}

function AreAnyPodsRunningWithLatestDeployTag(
  deploymentDetails: IApplicationDeploymentDetails
) {
  const { pods } = deploymentDetails;
  let isLatest = false;
  {
    pods.forEach(pod => {
      if (pod.phase === 'Running' && pod.latestDeployTag) {
        isLatest = true;
      }
    });
  }
  return isLatest;
}

function isActiveTagSameAsAuroraConfigTag(
  deploymentSpec?: IDeploymentSpec,
  deployment?: IApplicationDeployment
) {
  return (
    !!deploymentSpec &&
    !!deployment &&
    (deploymentSpec.version === deployment.version.deployTag.name ||
      deploymentSpec.releaseTo === deployment.version.deployTag.name)
  );
}

const warningMessage = (
  isLatestDeployTag: boolean,
  isCorrectDeployTag: boolean
) => {
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

function getApplicationDeploymentValues(
  deployment: IApplicationDeployment,
  deployTag: string | JSX.Element
) {
  let info: { [key: string]: any } = {};

  info = {
    Tag: deployTag,
    'Aurora version': deployment.version.auroraVersion,
    'Image repository': deployment.repository
      .split('/')
      .slice(1)
      .join('/')
  };
  if (deployment.message) {
    info.Message = deployment.message;
  }
  return info;
}

export default styled(InformationView)`
  .health-status {
    background: white;
    display: flex;
    p {
      padding: 10px 0;
      margin: 0;
      &:first-child {
        margin-right: 10px;
      }
    }
  }

  .labels {
    display: flex;
  }

  .info-deployments {
    display: flex;
  }
  .info-pod {
    flex: 1;
    margin-right: 10px;
  }
  .info-grid {
    display: flex;
    > div {
      margin-right: 40px;
    }
  }
  .styledDeployTag {
    padding-left: 25px;
  }
`;
