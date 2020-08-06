import {
  ColumnActionsMode,
  IColumn,
} from 'office-ui-fabric-react/lib-commonjs';
import { IPodsStatus, IPodResource } from 'models/Pod';
import { STATUS_COLORS } from 'models/Status';
import { IIconLinkData } from 'components/IconLink';

const podsStatusColumns: IColumn[] = [
  {
    fieldName: 'healthStatus',
    isResizable: true,
    key: '0',
    columnActionsMode: ColumnActionsMode.disabled,
    maxWidth: 50,
    minWidth: 50,
    name: '',
    iconName: '',
  },
  {
    fieldName: 'name',
    isResizable: true,
    key: '1',
    maxWidth: 400,
    minWidth: 300,
    name: 'Navn',
    iconName: '',
  },
  {
    fieldName: 'startedDate',
    isResizable: true,
    key: '2',
    maxWidth: 400,
    minWidth: 300,
    name: 'Startet',
    iconName: '',
  },
  {
    fieldName: 'numberOfRestarts',
    isResizable: true,
    key: '3',
    maxWidth: 250,
    minWidth: 150,
    name: 'Restartet',
    iconName: '',
  },
  {
    fieldName: 'externalLinks',
    isResizable: true,
    key: '4',
    columnActionsMode: ColumnActionsMode.disabled,
    maxWidth: 120,
    minWidth: 120,
    name: '',
    iconName: '',
  },
];

export const filterPodsStatus = (filter: string) => {
  return (v: IPodsStatus): boolean =>
    v.numberOfRestarts.toString().includes(filter) ||
    v.startedDate.includes(filter) ||
    (!!v.name.key && v.name.key.toString().includes(filter));
};

export default class PodsStatusService {
  public static DEFAULT_COLUMNS = podsStatusColumns;

  public handleIsActive(data: IIconLinkData): boolean {
    return data.href.startsWith('http');
  }

  public findLink(pod: IPodResource, name: string): string {
    const podLink = pod.links.find((l) => l.name === name);
    return podLink ? podLink.url : '#';
  }

  public getStatusColorAndIconForPod({
    managementResponses,
  }: IPodResource): { icon: string; color: string } {
    if (
      managementResponses &&
      managementResponses.health &&
      managementResponses.health.textResponse
    ) {
      if (
        JSON.parse(managementResponses.health.textResponse).hasOwnProperty(
          'status'
        )
      ) {
        const status = JSON.parse(managementResponses.health.textResponse)
          .status;
        switch (status) {
          case 'UP':
          case 'HEALTHY':
            return {
              icon: 'Completed',
              color: STATUS_COLORS.healthy,
            };
          case 'COMMENT':
          case 'OBSERVE':
            return {
              icon: 'Info',
              color: STATUS_COLORS.observe,
            };
          case 'OUT_OF_SERVICE':
          case 'DOWN':
            return {
              icon: 'Error',
              color: STATUS_COLORS.down,
            };
          case 'OFF':
            return {
              icon: 'Blocked',
              color: STATUS_COLORS.off,
            };
          default:
            return {
              icon: 'Info',
              color: STATUS_COLORS.unknown,
            };
        }
      }
    }
    return {
      icon: 'Info',
      color: STATUS_COLORS.unknown,
    };
  }
}
