import * as React from 'react';

import { IApplicationDeployment } from 'models/ApplicationDeployment';
import { Omit } from 'types/utils';

export interface IApplicationDeploymentContext {
  deployments: IApplicationDeployment[];
  allDeployments: IApplicationDeployment[];
  buildDeploymentLink: (
    deployment: IApplicationDeployment
  ) => React.ComponentType;
  filterPathUrl: string;
  affiliation: string;
}

const ApplicationDeploymentContext = React.createContext<
  IApplicationDeploymentContext
>({
  buildDeploymentLink: (_: IApplicationDeployment) => () => <div />,
  allDeployments: [],
  deployments: [],
  filterPathUrl: '',
  affiliation: ''
});

export const ApplicationDeploymentProvider =
  ApplicationDeploymentContext.Provider;

export function withApplicationDeployments<
  P extends IApplicationDeploymentContext
>(
  Component: React.ComponentType<P>
): React.ComponentClass<Omit<P, keyof IApplicationDeploymentContext>> {
  return class extends React.Component<
    Omit<P, keyof IApplicationDeploymentContext>
  > {
    public render() {
      return (
        <ApplicationDeploymentContext.Consumer>
          {props => {
            return <Component {...this.props as P} {...props} />;
          }}
        </ApplicationDeploymentContext.Consumer>
      );
    }
  };
}

export default withApplicationDeployments;
