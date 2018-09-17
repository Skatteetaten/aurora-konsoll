import response from './ResponseText';

const parsedResponseData: IScanResponseItems = JSON.parse(response);
interface IScanResponseItems {
  items: IResponseDataTypesRaw[];
}

interface IResponseDataTypesRaw {
  hostIp: number;
  podIp: number;
  result: {
    status: string;
    resolvedIp: string;
    message: string;
  };
}

export interface INetdebugResult {
  hostIp: number;
  podIp: number;
  status: string;
  resolvedIP: string;
  message: string;
}

export default parsedResponseData.items.map(
  item =>
    ({
      hostIp: item.hostIp,
      message: item.result.message,
      podIp: item.podIp,
      resolvedIP: item.result.resolvedIp,
      status: item.result.status
    } as INetdebugResult)
);
