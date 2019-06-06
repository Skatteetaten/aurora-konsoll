import {
  IColumn,
  ColumnActionsMode
} from 'office-ui-fabric-react/lib/DetailsList';
import { IInformationView } from 'models/ApplicationDeployment';

const informationViewColumns: IColumn[] = [
  {
    fieldName: 'healthStatus',
    isResizable: true,
    key: '0',
    columnActionsMode: ColumnActionsMode.disabled,
    maxWidth: 50,
    minWidth: 50,
    name: '',
    iconName: ''
  },
  {
    fieldName: 'name',
    isResizable: true,
    key: '1',
    columnActionsMode: ColumnActionsMode.disabled,
    maxWidth: 400,
    minWidth: 300,
    name: 'Navn',
    iconName: ''
  },
  {
    fieldName: 'startedDate',
    isResizable: true,
    key: '2',
    maxWidth: 400,
    minWidth: 300,
    name: 'Startet',
    iconName: ''
  },
  {
    fieldName: 'numberOfRestarts',
    isResizable: true,
    key: '3',
    maxWidth: 300,
    minWidth: 200,
    name: 'Antall omstart',
    iconName: ''
  },
  {
    fieldName: 'externalLinks',
    isResizable: true,
    key: '4',
    columnActionsMode: ColumnActionsMode.disabled,
    maxWidth: 150,
    minWidth: 100,
    name: '',
    iconName: ''
  }
];

export const filterInformationView = (filter: string) => {
  return (v: IInformationView): boolean =>
    v.numberOfRestarts.toString().includes(filter) ||
    v.startedDate.includes(filter);
};

export default class InformationViewService {
  public static DEFAULT_COLUMNS: IColumn[] = informationViewColumns;
}
