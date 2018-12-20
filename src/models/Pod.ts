export interface IPodResource {
  name: string;
  phase: string;
  restartCount: number;
  ready: boolean;
  startTime: string;
  latestDeployTag: boolean;
  managementResponses?: {
    health?: IManagementEndpointResponse;
  };
  links: Array<{
    name: string;
    url: string;
  }>;
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
