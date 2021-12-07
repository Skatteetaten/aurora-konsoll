export interface IUserSettings {
  applicationDeploymentFilters: IApplicationDeploymentFilters[];
}

export interface IApplicationDeploymentFilters {
  name?: string;
  affiliation: string;
  default: boolean;
  applications: string[];
  environments: string[];
}
