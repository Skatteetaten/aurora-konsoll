export interface IPodResource {
  name: string;
  status: string;
  restartCount: number;
  ready: boolean;
  startTime: string;
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
