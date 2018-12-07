export interface IPodResource {
  name: string;
  phase: string;
  deployTag: string;
  status: string;
  restartCount: number;
  ready: boolean;
  startTime: string;
  latestDeployTag: string;
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
