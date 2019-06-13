import * as React from 'react';
import styled from 'styled-components';

import { IPodResource, IPodsStatus } from 'models/Pod';
import SortableDetailsList from 'components/SortableDetailsList';
import PodsStatusService, {
  filterPodsStatus
} from 'services/PodsStatusService';
import { IApplicationDeploymentDetails } from 'models/ApplicationDeployment';
import Icon from 'aurora-frontend-react-komponenter/Icon';
import { STATUS_COLORS } from 'models/Status';
import { getLocalDatetime } from 'utils/date';
import IconLink, { IIconLinkData } from 'components/IconLink';
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
}

class PodsStatus extends React.Component<IPodsStatusProps, IPodsStatusState> {
  private menuButtonElements = Array(this.props.details.pods.length)
    .fill(0)
    .map(() => React.createRef<HTMLDivElement>());

  private resetInput = () => Array(this.props.details.pods.length).fill(false);

  private selection = new DetailsList.Selection();

  public state: IPodsStatusState = {
    isCalloutVisibleList: this.resetInput(),
    podResources: []
  };

  public handleIsActive(data: IIconLinkData) {
    return data.href.startsWith('http');
  }

  public findLink(pod: IPodResource, name: string): string {
    const podLink = pod.links.find(l => l.name === name);
    return podLink ? podLink.url : '#';
  }

  public getStatusColorAndIconForPod({
    managementResponses
  }: IPodResource): { icon: string; color: string } {
    if (
      managementResponses &&
      managementResponses.health &&
      managementResponses.health.textResponse
    ) {
      const status = JSON.parse(managementResponses.health.textResponse).status;
      switch (status) {
        case 'UP':
        case 'HEALTHY':
          return {
            icon: 'Completed',
            color: STATUS_COLORS.healthy
          };
        case 'COMMENT':
        case 'OBSERVE':
          return {
            icon: 'Info',
            color: STATUS_COLORS.observe
          };
        case 'OUT_OF_SERVICE':
        case 'DOWN':
          return {
            icon: 'Error',
            color: STATUS_COLORS.down
          };
        case 'OFF':
          return {
            icon: 'Blocked',
            color: STATUS_COLORS.off
          };
        default:
          return {
            icon: 'Info',
            color: STATUS_COLORS.unknown
          };
      }
    }
    return {
      icon: 'Info',
      color: STATUS_COLORS.unknown
    };
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

  public renderErrorsForPod = (pod: IPodResource) => {
    if (
      pod.managementResponses &&
      pod.managementResponses.links &&
      pod.managementResponses.links.error
    ) {
      return (
        <p>
          Feilkode: {pod.managementResponses.links.error.code}
          <br />
          MELDING: {pod.managementResponses.links.error.message}
        </p>
      );
    } else {
      return <p>Tipp topp tommel opp</p>;
    }
  };

  public getItemsFromChildComp = (currentViewItems: any) => {
    const { podResources } = this.state;
    const pods = currentViewItems.map((it: IPodsStatus) => it.name.key);
    if (pods.length > 0) {
      const getPod = (pod: string) =>
        this.props.details.pods.find(it => it.name === pod);
      console.log(pods.map(it => getPod(it)));
      const podsWithoutNull: IPodResource[] = pods
        .map(it => getPod(it))
        .filter((element: IPodResource) => {
          return element !== undefined;
        });

      if (JSON.stringify(podsWithoutNull) !== JSON.stringify(podResources)) {
        this.setState({
          podResources: podsWithoutNull,
          isCalloutVisibleList: this.resetInput()
        });
      }
    }
  };

  public applicationDeploymentPods = (): IPodsStatus[] => {
    const { details } = this.props;
    const { isCalloutVisibleList, podResources } = this.state;

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

    return (podResources.length > 0 ? podResources : details.pods).map(
      (pod: IPodResource, index: number) => {
        return {
          key: pod.name,
          healthStatus: (
            <>
              <span ref={this.menuButtonElements[index]}>
                <Icon
                  iconName={this.getStatusColorAndIconForPod(pod).icon}
                  onClick={onIndexChange(index)}
                  style={{
                    fontSize: '25px',
                    color: this.getStatusColorAndIconForPod(pod).color,
                    cursor: 'pointer',
                    float: 'none'
                  }}
                />
              </span>
              {this.state.isCalloutVisibleList[index] && (
                <Callout
                  target={this.menuButtonElements[index].current}
                  gapSpace={0}
                  directionalHint={Callout.POS_BOTTOM_LEFT}
                  color={
                    pod.managementResponses &&
                    pod.managementResponses.links &&
                    pod.managementResponses.links.error
                      ? Callout.ERROR
                      : Callout.BASIC
                  }
                  onClose={onIndexChange(index)}
                  doNotLayer={false}
                >
                  {this.renderErrorsForPod(pod)}
                </Callout>
              )}
            </>
          ),
          name: (
            <ActionButton
              target="_blank"
              rel="noopener noreferrer"
              href={this.findLink(pod, 'ocp_console_details')}
              title={pod.name}
              key={pod.name}
              style={{ margin: 0 }}
            >
              {pod.name}
            </ActionButton>
          ),
          startedDate: getLocalDatetime(pod.startTime),
          numberOfRestarts: pod.restartCount,
          externalLinks: (
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end'
              }}
            >
              {this.podAction(pod)}
              <IconLink
                name="Timeline"
                isActiveHandler={this.handleIsActive}
                href={this.findLink(pod, 'metrics')}
                title="Grafana"
              />
              <IconLink
                name="FormatAlignLeft"
                isActiveHandler={this.handleIsActive}
                href={this.findLink(pod, 'splunk')}
                title="Splunk"
              />
            </div>
          )
        };
      }
    );
  };

  public render() {
    const { className } = this.props;
    return (
      <div className={className}>
        <div className="styledTable">
          <SortableDetailsList
            passItemsToParent={this.getItemsFromChildComp}
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
    .ms-Button-flexContainer {
      align-items: baseline;
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
