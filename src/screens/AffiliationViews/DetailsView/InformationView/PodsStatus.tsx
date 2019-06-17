import * as React from 'react';
import styled from 'styled-components';

import { IPodResource, IPodsStatus } from 'models/Pod';
import SortableDetailsList from 'components/SortableDetailsList';
import PodsStatusService, {
  filterPodsStatus
} from 'services/PodsStatusService';
import { IApplicationDeploymentDetails } from 'models/ApplicationDeployment';
import Icon from 'aurora-frontend-react-komponenter/Icon';
import { getLocalDatetime } from 'utils/date';
import IconLink from 'components/IconLink';
import Callout from 'aurora-frontend-react-komponenter/Callout';
import HealthResponseDialogSelector from './HealthResponseDialogSelector/HealthResponseDialogSelector';
import DetailsList from 'aurora-frontend-react-komponenter/DetailsList';
import ActionButton from 'aurora-frontend-react-komponenter/ActionButton';

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
    menuButtonElements: this.createMenuButtonElements()
  };

  public componentDidUpdate(prevProps: IPodsStatusProps) {
    const { details } = this.props;

    if (
      JSON.stringify(prevProps.details.pods) !== JSON.stringify(details.pods)
    ) {
      this.setState({
        podResources: details.pods,
        menuButtonElements: this.createMenuButtonElements(),
        isCalloutVisibleList: this.resetInput()
      });
    }
  }

  public podAction = (pod: IPodResource) => {
    const { managementResponses } = pod;
    const { isUpdating, refreshApplicationDeployment } = this.props;

    if (!managementResponses || !managementResponses.health) {
      return null;
    }
    return (
      <div>
        <HealthResponseDialogSelector
          health={managementResponses.health}
          isUpdating={isUpdating}
          refreshApplicationDeployment={refreshApplicationDeployment}
        />
      </div>
    );
  };

  public getItemsFromChildComp = (currentViewItems: any) => {
    const { podResources } = this.state;
    const { details } = this.props;
    const pods = currentViewItems.map((it: IPodsStatus) => it.name.key);
    if (pods.length > 0) {
      const getPod = (pod: string) => details.pods.find(it => it.name === pod);

      const sortedPods: IPodResource[] = pods
        .map(it => getPod(it))
        .filter((element: IPodResource) => {
          return element !== undefined;
        });

      if (JSON.stringify(sortedPods) !== JSON.stringify(podResources)) {
        this.setState({
          podResources: sortedPods,
          isCalloutVisibleList: this.resetInput()
        });
      }
    }
  };

  public applicationDeploymentPods = (): IPodsStatus[] => {
    const {
      isCalloutVisibleList,
      podResources,
      menuButtonElements
    } = this.state;

    const onIndexChange = (index: number) => () => {
      if (isCalloutVisibleList[index]) {
        this.setState({
          isCalloutVisibleList: this.resetInput()
        });
      } else {
        const newItems = this.resetInput();
        newItems[index] = true;
        this.setState({
          isCalloutVisibleList: newItems
        });
      }
    };

    return podResources.map((pod: IPodResource, index: number) => {
      return {
        healthStatus: (
          <>
            <span ref={menuButtonElements[index]}>
              <Icon
                iconName={
                  this.PodsStatusService.getStatusColorAndIconForPod(pod).icon
                }
                onClick={onIndexChange(index)}
                style={{
                  fontSize: '25px',
                  cursor: 'pointer',
                  float: 'none',
                  color: this.PodsStatusService.getStatusColorAndIconForPod(pod)
                    .color
                }}
              />
            </span>
            {isCalloutVisibleList[index] &&
              pod.managementResponses &&
              pod.managementResponses.links &&
              pod.managementResponses.links.error && (
                <Callout
                  target={menuButtonElements[index].current}
                  gapSpace={0}
                  directionalHint={Callout.POS_BOTTOM_LEFT}
                  color={Callout.ERROR}
                  onClose={onIndexChange(index)}
                  doNotLayer={false}
                >
                  <p>
                    Feilkode: {pod.managementResponses.links.error.code}
                    <br />
                    Melding: {pod.managementResponses.links.error.message}
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
        )
      };
    });
  };

  public render() {
    const { className } = this.props;
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
`;
