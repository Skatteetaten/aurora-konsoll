import { ILink } from './ApplicationDeployment';

export interface IPodResource {
  name: string;
  phase: string;
  restartCount: number;
  ready: boolean;
  startTime?: string;
  latestDeployTag: boolean;
  managementResponses?: {
    links?: {
      error?: IManagementEndpointError;
    };
    health?: IManagementEndpointResponse;
  };
  links: ILink[];
}

export interface IManagementEndpointResponse {
  hasResponse: boolean;
  textResponse?: string;
  createdAt: string;
  httpCode?: number;
  url?: string;
  error?: IManagementEndpointError;
}

export interface IManagementEndpointError {
  code: string;
  message?: string;
}

export interface IPodsStatus {
  healthStatus: JSX.Element;
  name: JSX.Element;
  startedDate: string;
  numberOfRestarts: number;
  externalLinks: JSX.Element;
}
