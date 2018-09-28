export interface IPodResource {
  name: string;
  status: string;
  restartCount: number;
  ready: boolean;
  startTime: string;
  managementResponses?: {
    health?: IHttpResponse;
  };
  links: Array<{
    name: string;
    url: string;
  }>;
}

export interface IHttpResponse {
  loadedTime: string;
  textResponse: string;
}
