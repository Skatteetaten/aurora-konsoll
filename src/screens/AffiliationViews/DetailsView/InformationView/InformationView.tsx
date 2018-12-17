import * as React from 'react';
import styled from 'styled-components';

import Tooltip from 'components/IconWithTooltip';
import InfoContent from 'components/InfoContent';
import Spinner from 'components/Spinner';
import {
  IApplicationDeployment,
  IApplicationDeploymentDetails
} from 'models/ApplicationDeployment';
import { IDeploymentSpec } from 'models/DeploymentSpec';
import PodStatus from './PodStatus';

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

  const TagWithWarningMessage =
    !isLatestDeployTag || !isCorrectDeploytag ? (
      !Array.isArray(pods) || !pods.length ? (
        deployTagName
      ) : (
        <>
          <Tooltip
            content={`Dette deployet kjører ikke ønsket versjon.\n\u2022 ${message}`}
            icon="Info"
            color="red"
          />
          <div className="styledDeployTag" title={deployTagName}>
            {deployTagName}
          </div>
        </>
      )
    ) : (
      deployTagName
    );

  return (
    <div className={className}>
      <div className="info-grid">
        <div>
          <h3>Gjeldende AuroraConfig</h3>
          <InfoContent values={getDeploymentSpecValues(deploymentSpec)} />
        </div>
        <div>
          <h3>Aktivt deployment</h3>
          <InfoContent
            values={getApplicationDeploymentValues(
              deployment,
              TagWithWarningMessage
            )}
          />
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
  if (
    deploymentSpec &&
    deployment &&
    deploymentSpec.version === deployment.version.deployTag.name
  ) {
    return true;
  } else {
    return false;
  }
}

const warningMessage = (
  isLatestDeployTag: boolean,
  isCorrectDeployTag: boolean
) => {
  const newerImageAvailable = `Det finnes et nyere image for denne taggen tilgjengelig på Docker Registry.`;
  const differentVersions = `Aktivt deploy sin tag stemmer ikke overens med Aurora Config. Deploy på nytt.`;
  if (!isLatestDeployTag && !isCorrectDeployTag) {
    return `${newerImageAvailable}\n\u2022 ${differentVersions}`;
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
  return {
    Tag: deployTag,
    'Aurora version': deployment.version.auroraVersion,
    'Image repository': deployment.repository
      .split('/')
      .slice(1)
      .join('/'),
    Status:
      deployment.status.code +
      (deployment.status.comment && ` (${deployment.status.comment})`)
  };
}

export default styled(InformationView)`
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
    div {
      margin-right: 20px;
    }
  }
  .styledDeployTag {
    padding-left: 25px;
  }
`;
