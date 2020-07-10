import { IColumn } from 'office-ui-fabric-react/lib-commonjs';

const websealTableColumns: IColumn[] = [
  {
    key: '0',
    name: 'Host',
    fieldName: 'host',
    minWidth: 500,
    maxWidth: 600,
    iconName: '',
  },
  {
    key: '1',
    name: 'Roller',
    fieldName: 'roles',
    minWidth: 800,
    maxWidth: 1000,
    iconName: '',
  },
];

type ColumnRenderFunc = (item: { key: string }) => JSX.Element;

const websealDialogColumns = (onRender: ColumnRenderFunc): IColumn[] => [
  {
    key: '0',
    name: 'Key',
    fieldName: 'key',
    minWidth: 400,
    maxWidth: 400,
    onRender,
  },
  {
    key: '1',
    name: 'Value',
    fieldName: 'value',
    minWidth: 200,
    maxWidth: 200,
  },
];

export interface IWebsealTableColumns {
  roles: string;
  host: string;
}

export const filterWebsealView = (filter: string) => {
  return (v: IWebsealTableColumns): boolean =>
    v.host.includes(filter) || v.roles.includes(filter);
};

class WebsealService {
  public static DEFAULT_COLUMNS = websealTableColumns;
  public static JUNCTION_COLUMNS = websealDialogColumns;

  public addProperties = (type: string): any[] => {
    const parsedType = JSON.parse(type);
    const ownProps = Object.keys(parsedType);
    let i = ownProps.length;
    const resArray = new Array(i);
    while (i--) {
      resArray[i] = {
        key: ownProps[i],
        value: parsedType[ownProps[i]],
      };
    }
    return resArray;
  };
}

export default WebsealService;
