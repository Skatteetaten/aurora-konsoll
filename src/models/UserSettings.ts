export interface IUserSettings {
  applicationDeploymentFilters: IApplicationDeploymentFilters[];
}

export interface IApplicationDeploymentFilters {
  name?: string;
  affiliation: string;
  applications: string[];
  environments: string[];
}