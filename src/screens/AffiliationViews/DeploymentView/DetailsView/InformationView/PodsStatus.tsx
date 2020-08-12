import * as React from 'react';
import styled from 'styled-components';

import { IPodResource, IPodsStatus } from 'models/Pod';
import SortableDetailsList from 'components/SortableDetailsList';
import PodsStatusService, {
  filterPodsStatus,
} from 'services/PodsStatusService';
import { IApplicationDeploymentDetails } from 'models/ApplicationDeployment';
import Icon from '@skatteetaten/frontend-components/Icon';
import { getLocalDatetime } from 'utils/date';
import IconLink from 'components/IconLink';
import Callout from '@skatteetaten/frontend-components/Callout';
import DetailsList from '@skatteetaten/frontend-components/DetailsList';
import ActionButton from '@skatteetaten/frontend-components/ActionButton';
import ManagementResponseDialogSelector from 'components/ManagementResponseDialog';

interface IPodsStatusProps {
  details: IApplicationDeploymentDetails;
  isUpdating: boolean;
  refreshApplicationDeployment: () => void;
  className?: string;
}

interface IPodsStatusState {
  isCalloutVisibleList: boolean[];
  podResources: IPodResource[];
  menuButtonElements: React.RefObject<HTMLDivElement>[];
}

class PodsStatus extends React.Component<IPodsStatusProps, IPodsStatusState> {
  private PodsStatusService = new PodsStatusService();

  private resetInput = () => Array(this.props.details.pods.length).fill(false);

  private createMenuButtonElements = () =>
    Array(this.props.details.pods.length)
      .fill(0)
      .map(() => React.createRef<HTMLDivElement>());

  private selection = new DetailsList.Selection();

  public state: IPodsStatusState = {
    isCalloutVisibleList: this.resetInput(),
    podResources: this.props.details.pods,
    menuButtonElements: this.createMenuButtonElements(),
  };

  public componentDidUpdate(prevProps: IPodsStatusProps) {
    const { details } = this.props;

    if (
      JSON.stringify(prevProps.details.pods) !== JSON.stringify(details.pods)
    ) {
      this.setState({
        podResources: details.pods,
        menuButtonElements: this.createMenuButtonElements(),
        isCalloutVisibleList: this.resetInput(),
      });
    }
  }

  public podAction = (pod: IPodResource) => {
    const { managementResponses } = pod;
    const { isUpdating, refreshApplicationDeployment } = this.props;

    if (!managementResponses) {
      return null;
    }

    const buttons: JSX.Element[] = [];
    if (managementResponses.health) {
      buttons.push(
        <ManagementResponseDialogSelector
          key="management-health-dialog"
          icon="Favorite"
          title="Pod helsestatus"
          response={managementResponses.health}
          isUpdating={isUpdating}
          refreshApplicationDeployment={refreshApplicationDeployment}
        />
      );
    }
    if (managementResponses.env) {
      buttons.push(
        <ManagementResponseDialogSelector
          key="management-env-dialog"
          icon="Description"
          title="Pod miljøvariabler"
          response={managementResponses.env!!}
          isUpdating={isUpdating}
          refreshApplicationDeployment={refreshApplicationDeployment}
        />
      );
    }

    if (buttons.length === 0) {
      return null;
    }

    return <>{buttons}</>;
  };

  public getItemsFromChildComp = (currentViewItems: any) => {
    const { podResources } = this.state;
    const { details } = this.props;
    const pods = currentViewItems.map((it: IPodsStatus) => it.name.key);
    if (pods.length > 0) {
      const getPod = (pod: string) =>
        details.pods.find((it) => it.name === pod);

      const sortedPods: IPodResource[] = pods
        .map((it) => getPod(it))
        .filter((element?: IPodResource) => element !== undefined);

      if (JSON.stringify(sortedPods) !== JSON.stringify(podResources)) {
        this.setState({
          podResources: sortedPods,
          isCalloutVisibleList: this.resetInput(),
        });
      }
    }
  };

  public applicationDeploymentPods = (): IPodsStatus[] => {
    const {
      isCalloutVisibleList,
      podResources,
      menuButtonElements,
    } = this.state;

    const onIndexChange = (index: number) => () => {
      if (isCalloutVisibleList[index]) {
        this.setState({
          isCalloutVisibleList: this.resetInput(),
        });
      } else {
        const newItems = this.resetInput();
        newItems[index] = true;
        this.setState({
          isCalloutVisibleList: newItems,
        });
      }
    };

    return podResources.map((pod: IPodResource, index: number) => {
      const hasManagementInterfaceError =
        pod.managementResponses &&
        pod.managementResponses.links &&
        pod.managementResponses.links.error;

      return {
        healthStatus: (
          <>
            <span ref={menuButtonElements[index]}>
              <Icon
                iconName={
                  this.PodsStatusService.getStatusColorAndIconForPod(pod).icon
                }
                onClick={onIndexChange(index)}
                title={hasManagementInterfaceError ? 'Vis feilmelding' : ''}
                style={{
                  fontSize: '25px',
                  cursor: 'pointer',
                  float: 'none',
                  color: this.PodsStatusService.getStatusColorAndIconForPod(pod)
                    .color,
                }}
              />
            </span>
            {isCalloutVisibleList[index] && hasManagementInterfaceError && (
              <Callout
                target={menuButtonElements[index].current}
                gapSpace={0}
                directionalHint={Callout.POS_BOTTOM_LEFT}
                color={Callout.ERROR}
                onClose={onIndexChange(index)}
                doNotLayer={false}
              >
                <p>
                  Feilkode: {hasManagementInterfaceError.code}
                  <br />
                  Melding: {hasManagementInterfaceError.message}
                </p>
              </Callout>
            )}
          </>
        ),
        name: (
          <ActionButton
            target="_blank"
            rel="noopener noreferrer"
            href={this.PodsStatusService.findLink(pod, 'ocp_console_details')}
            title={pod.name}
            key={pod.name}
          >
            {pod.name}
          </ActionButton>
        ),
        startedDate: getLocalDatetime(pod.startTime),
        numberOfRestarts: pod.restartCount,
        externalLinks: (
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            {this.podAction(pod)}
            <IconLink
              name="Timeline"
              iconStyle={{ fontSize: '25px' }}
              isActiveHandler={this.PodsStatusService.handleIsActive}
              href={this.PodsStatusService.findLink(pod, 'metrics')}
              title="Grafana"
            />
            <IconLink
              name="FormatAlignLeft"
              iconStyle={{ fontSize: '25px' }}
              isActiveHandler={this.PodsStatusService.handleIsActive}
              href={this.PodsStatusService.findLink(pod, 'splunk')}
              title="Splunk"
            />
          </div>
        ),
      };
    });
  };

  public render() {
    const { className, isUpdating } = this.props;
    return (
      <div className={className}>
        <div className="styledTable">
          <SortableDetailsList
            passItemsToParentComp={this.getItemsFromChildComp}
            filter=""
            items={this.applicationDeploymentPods()}
            selection={this.selection}
            filterView={filterPodsStatus}
            columns={PodsStatusService.DEFAULT_COLUMNS}
            isHeaderVisible={true}
            isRefreshing={isUpdating}
          />
        </div>
      </div>
    );
  }
}

export default styled(PodsStatus)`
  .styledTable {
    display: flex;
    grid-area: table;
    i {
      float: right;
    }
    .ms-Button {
      height: auto;
    }
    .ms-Button-label {
      margin: 0;
    }
    .ms-Button-icon {
      margin: 0;
    }
  }

  .ms-DetailsRow-cell:nth-child(2),
  .ms-DetailsRow-cell:nth-child(3),
  .ms-DetailsRow-cell:nth-child(4) {
    margin-top: 4px;
  }
  .ms-DetailsRow-cell:nth-child(5) {
    text-decoration: none !important;
  }
`;
