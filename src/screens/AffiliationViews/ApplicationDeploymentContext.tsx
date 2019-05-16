import * as React from 'react';

import {
  IApplicationDeployment,
  IApplicationDeploymentDetails
} from 'models/ApplicationDeployment';
import { Omit } from 'types/utils';

export interface IApplicationDeploymentContext {
  deployments: IApplicationDeployment[];
  allDeployments: IApplicationDeployment[];
  fetchApplicationDeployments: () => void;
  refreshDeployments: () => void;
  buildDeploymentLink: (
    deployment: IApplicationDeployment
  ) => React.ComponentType;
  filterPathUrl: string;
}

const ApplicationDeploymentContext = React.createContext<
  IApplicationDeploymentContext
>({
  buildDeploymentLink: (_: IApplicationDeployment) => () => <div />,
  allDeployments: [],
  deployments: [],
  refreshDeployments: () => {
    return;
  },
  fetchApplicationDeployments: () => {
    return;
  },
  filterPathUrl: ''
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
