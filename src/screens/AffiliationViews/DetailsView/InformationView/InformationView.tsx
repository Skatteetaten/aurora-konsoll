import * as React from 'react';
import styled from 'styled-components';

import Spinner from 'components/Spinner';
import {
  IApplicationDeployment,
  IApplicationDeploymentDetails,
  IInformationView
} from 'models/ApplicationDeployment';
import { ActiveDeploymentInformation } from './ActiveDeploymentInformation';
import { DeploymentSpecInformation } from './DeploymentSpecInformation';
import { GitAndBuildInformation } from './GitAndBuildInformation';
import { ManagementInterface } from './ManagementInterface';
import PodStatus, {
  getStatusColorForPod,
  getStatusIconForPod,
  findLink,
  handleIsActive
} from './PodStatus';
import { ServiceLinks } from './ServiceLinks';
import StatusCheckReportCard from './StatusCheckReportCard';
import SortableDetailsList from 'components/SortableDetailsList';
import InformationViewService, {
  filterInformationView
} from 'services/InformationViewService';
import { getLocalDatetime } from 'utils/date';
import Icon from 'aurora-frontend-react-komponenter/Icon';
import IconLink from 'components/IconLink';

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
  className
}: IInformationViewProps) => {
  const { deploymentSpec, pods } = deploymentDetails;
  if (isFetchingDetails) {
    return <Spinner />;
  }

  const hasManagementInterface =
    !!deploymentSpec && !!deploymentSpec.management;

  const hasManagementLinksErrors =
    pods.map(
      pod =>
        pod.managementResponses &&
        pod.managementResponses.links &&
        pod.managementResponses.links.error
    ).length > 0;

  const consoleLog = (name: string) => {
    console.log(name);
  };

  const applicationDeploymentPods = (): IInformationView[] => {
    return deploymentDetails.pods.map(pod => ({
      healthStatus: (
        <Icon
          iconName={getStatusIconForPod(pod)}
          onClick={consoleLog(getStatusIconForPod(pod))}
          style={{
            fontSize: '25px',
            color: getStatusColorForPod(pod),
            cursor: 'pointer'
          }}
        />
      ),
      name: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={findLink(pod, 'ocp_console_details')}
          title={pod.name}
        >
          {pod.name}
        </a>
      ),
      startedDate: getLocalDatetime(pod.startTime),
      numberOfRestarts: pod.restartCount,
      externalLinks: (
        <IconLink
          name="Timeline"
          isActiveHandler={handleIsActive}
          href={findLink(pod, 'metrics')}
          title="Grafana"
        />
      )
    }));
  };

  return (
    <div className={className}>
      <div className="info-grid">
        <div>
          <ActiveDeploymentInformation
            pods={pods}
            deployment={deployment}
            deploymentSpec={deploymentSpec}
          />
          <DeploymentSpecInformation deploymentSpec={deploymentSpec} />
          <GitAndBuildInformation deploymentDetails={deploymentDetails} />
        </div>
        <div>
          <h3>AuroraStatus for deployment</h3>
          <StatusCheckReportCard deployment={deployment} />
          <ServiceLinks serviceLinks={deploymentDetails.serviceLinks} />
        </div>
        <div>
          <ManagementInterface
            hasManagementInterface={hasManagementInterface}
            details={deploymentDetails}
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
        {/* {pods.map(pod => (
          <PodStatus
            key={pod.name}
            pod={pod}
            className="info-pod"
            isUpdating={isUpdating}
            refreshApplicationDeployment={refreshApplicationDeployment}
          />
        ))} */}
        {hasManagementLinksErrors && (
          <SortableDetailsList
            filter=""
            items={applicationDeploymentPods()}
            filterView={filterInformationView}
            columns={InformationViewService.DEFAULT_COLUMNS}
            isHeaderVisible={true}
          />
        )}
      </div>
    </div>
  );
};

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
    flex-wrap: wrap;
  }

  .info-pod {
    max-width: 400px;
    margin-right: 10px;
    margin-bottom: 10px;
  }

  .info-grid {
    display: flex;
    > div {
      margin-right: 40px;
    }
  }
  .ms-Button-flexContainer {
    align-items: baseline;
    margin: 0;
  }
`;
